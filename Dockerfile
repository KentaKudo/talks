FROM marpteam/marp-cli

RUN apt-get update && \
    apt-get install -y \
    libreoffice \
    libreoffice-impress \
    && rm -rf /var/lib/apt/lists/*

CMD ["marp"]
