def clean() {
    log "Cleaning the directory and resetting any changes"
    sh "git clean -fd"
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this