FROM debian:latest
RUN apt update && apt install  openssh-server sudo -y
RUN groupadd sshgroup && useradd -ms /bin/bash -g sshgroup -G sudo red
RUN mkdir -p /home/red/.ssh
COPY ./keys/key.pub /home/red/.ssh/authorized_keys
RUN echo "red ALL=(ALL) NOPASSWD:ALL " >> /etc/sudoers
RUN chown red:sshgroup /home/red/.ssh/authorized_keys && chmod 600 /home/red/.ssh/authorized_keys
RUN echo "Port 9231" >> /etc/ssh/sshd_config
RUN service ssh start
EXPOSE 9231
CMD ["/usr/sbin/sshd","-D"]
