FROM archlinux:latest

RUN pacman -Sy python-pip --noconfirm
RUN pip install awscli