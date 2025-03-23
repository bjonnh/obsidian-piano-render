.PHONY: build dev version setup shell ensure-image clean update

ensure-image:
	@if ! docker image inspect piano-render >/dev/null 2>&1; then \
		echo "Image piano-render not found, building..."; \
		$(MAKE) setup; \
	fi

# Define common docker run parameters
DOCKER_RUN_CMD = podman run --rm \
	-v $(PWD):/app:Z \
	-v piano-render-node-modules:/app/node_modules \
	piano-render

DOCKER_RUN_CMD = podman run -it --rm \
 	-v $(PWD):/app:Z \
 	-v piano-render-node-modules:/app/node_modules \
 	piano-render

build: ensure-image
	$(DOCKER_RUN_CMD) npm run build

dev: ensure-image
	$(DOCKER_RUN_CMD) npm run dev

version: ensure-image
	$(DOCKER_RUN_CMD) npm run version

setup:
	docker build -t piano-render .
	$(DOCKER_RUN_CMD) npm install

shell: ensure-image
	$(DOCKER_RUN_CMD) sh

# Copy plugin files to Obsidian plugins directory
update: build
	mkdir -p ~/Documents/Notes/.obsidian/plugins/piano-render
	cp main.js styles.css manifest.json ~/Documents/Notes/.obsidian/plugins/piano-render/

# Clean up any local node_modules that might have been created
clean:
	rm -rf node_modules
