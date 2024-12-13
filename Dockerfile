FROM ubuntu:20.04
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
COPY ./requirements.txt .
RUN apt-get update && apt-get install -y \
    libxrender1 \
    python3.9 \
    python3.9-distutils \
    python3-pip \
    libxext6 \
    libfontconfig1 \
    libssl1.1 \
    wget \
    fontconfig \
    libjpeg-turbo8 \
    xfonts-75dpi \
    xfonts-base \
    && apt-get clean
RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.bionic_amd64.deb \
    && dpkg -i wkhtmltox_0.12.6-1.bionic_amd64.deb \
    && apt-get install -f -y \
    && rm wkhtmltox_0.12.6-1.bionic_amd64.deb
ENV PATH="/usr/local/bin/wkhtmltopdf:$PATH"
RUN python3.9 -m pip install --upgrade pip
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 10 \
    && update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 10
RUN pip3 install -r requirements.txt
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ledger \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY . /magnus
WORKDIR /magnus
COPY ./myentry.sh /
ENTRYPOINT ["sh", "/myentry.sh"]
