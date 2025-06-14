.PHONY: help build run run-editable

help:
	@echo "Available targets:"
	@echo "  build		Build the Docker image for Marp CLI."
	@echo "		Usage: make build"
	@echo "  run		Run Marp CLI in Docker to generate PPTX from a markdown file."
	@echo "		Usage: make run DIR=./slides FILE=yourfile.md"
	@echo "  run-editable	Run Marp CLI in Docker to generate editable PPTX from a markdown file."
	@echo "		Usage: make run-editable DIR=./slides FILE=yourfile.md"

# run:
# 	docker run \
# 		--rm --init \
# 		-v $(PWD):/home/marp/app/ \
# 		-e LANG=$(LANG) \
# 		marpteam/marp-cli $(FILE) --pptx --pptx-editable

build:
	docker build -t marp-libreoffice .

run:
	docker run \
		--rm --init \
		-v $$(pwd)/$(DIR):/home/marp/app/ \
		-e LANG=$(LANG) \
		marp-libreoffice $(FILE) --pptx

run-editable:
	docker run \
		--rm --init \
		-v $$(pwd)/$(DIR):/home/marp/app/ \
		-e LANG=$(LANG) \
		marp-libreoffice $(FILE) --pptx --pptx-editable
