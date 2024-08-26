fswatch -0 source assets templates scripts | while read -d "" event
  do
    echo ${event}
    sh build.sh
  done