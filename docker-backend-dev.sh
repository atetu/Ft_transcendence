docker run \
  --name ft-transcendence-backend \
  -it \
  --net ft-transcendence \
  -v $(pwd)/backend:/app \
  -p 3000:3000 \
  --rm \
  ft-transcendence-base
