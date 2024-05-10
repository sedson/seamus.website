rm -rf www/
cp -Rp assets/ www/
git log --pretty=format:"%ad %s" --date=short > log.txt
node scripts/build.js