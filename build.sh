rm -rf www/
cp -Rp assets/ www/

LATEST=$(git log -1 --pretty=format:"%ad %s" --date=short)

if [ -f log.txt ]; then
  FIRST=$(head -n 1 log.txt)

  if [ "$FIRST" != "$LATEST" ]; then
    {
      echo "$LATEST"
      cat log.txt
    } > log.tmp && mv log.tmp log.txt
  fi
else
  echo "$LATEST" > log.txt
fi

node scripts/build.js
