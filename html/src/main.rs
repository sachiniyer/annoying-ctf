use dotenv;
use postgres::{Client, NoTls};
use tide::prelude::*;
use tide::Request;

#[derive(Debug, Deserialize)]
struct Data {
    username: String,
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    dotenv::dotenv().ok();
    let mut app = tide::new();
    app.at("/").post(db_call);
    let listen = std::env::var("LISTEN_URL").expect("LISTEN_URL must be set.");
    app.listen(listen).await?;
    Ok(())
}

async fn db_call(mut req: Request<()>) -> tide::Result {
    let host = std::env::var("POSTGRES_HOST").expect("POSTGRES_HOST must be set.");
    let user = std::env::var("POSTGRES_USER").expect("POSTGRES_USER must be set.");
    let password = std::env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set.");

    let Data { username } = req.body_json().await?;
    let mut client = Client::connect(
        &format!("host={} user={} password={}", host, user, password),
        NoTls,
    )?;
    let rows = match client.query(
        &(format!("SELECT id FROM info WHERE topic='{}'", username)),
        &[],
    ) {
        Ok(p) => p,
        Err(e) => panic!("Issue with database, {}", e),
    };
    let ret;
    if rows.len() > 0 {
        ret = rows[0].get("id");
    } else {
        ret = "NONE";
    }

    Ok(format!("Hello, {}! I've put in an order for shoes", ret).into())
}
