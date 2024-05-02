def build() {
    log "Building the Docker image..."
    sh "docker build -t your-image-name -f ${env.PROJECT_DIR}/Dockerfile ${env.PROJECT_DIR}"
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this