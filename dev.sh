fswatch -0 source assets templates | while read -d "" event
  do
    echo ${event}
    sh build.sh
  done