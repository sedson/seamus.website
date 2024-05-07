rm -rf www/
cp -Rp assets/ www/
git log --oneline > log.txt
node scripts/build.js