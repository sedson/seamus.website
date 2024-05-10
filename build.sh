rm -rf www/
cp -Rp assets/ www/
git log --pretty=format:"%h %ad%x09%an%x09%s" --date=short > log.txt
node scripts/build.js