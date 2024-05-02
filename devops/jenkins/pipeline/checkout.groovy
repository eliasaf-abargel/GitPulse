def checkout(branch, depth) {
    log "Fetching the latest changes from the remote repository"
    checkout([$class: 'GitSCM',
              branches: [[name: "*/${branch}"]],
              doGenerateSubmoduleConfigurations: false,
              extensions: [[$class: 'CloneOption',
                            depth: "${depth}",
                            noTags: true,
                            shallow: true]],
              submoduleCfg: [],
              userRemoteConfigs: [[url: 'git@github.com:eliasaf-abargel/GitPulse.git']]])
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this