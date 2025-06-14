.PHONY: help build run-pdf run-pptx run-editable-pptx

help:
	@echo "Available targets:"
	@echo "  build		Build the Docker image for Marp CLI."
	@echo "		Usage: make build"
	@echo "  run-pdf		Run Marp CLI in Docker to generate PDF from a markdown file."
	@echo "		Usage: make run-pdf DIR=./slides FILE=yourfile.md"
	@echo "  run-pptx		Run Marp CLI in Docker to generate PPTX from a markdown file."
	@echo "		Usage: make run-pptx DIR=./slides FILE=yourfile.md"
	@echo "  run-editable-pptx	Run Marp CLI in Docker to generate editable PPTX from a markdown file."
	@echo "		Usage: make run-editable-pptx DIR=./slides FILE=yourfile.md"

# run:
# 	docker run \
# 		--rm --init \
# 		-v $(PWD):/home/marp/app/ \
# 		-e LANG=$(LANG) \
# 		marpteam/marp-cli $(FILE) --pptx --pptx-editable

build:
	docker build -t marp-libreoffice .

run-pdf:
	docker run \
		--rm --init \
		-v $$(pwd)/$(DIR):/home/marp/app/ \
		-e LANG=$(LANG) \
		marp-libreoffice $(FILE) --pdf

run-pptx:
	docker run \
		--rm --init \
		-v $$(pwd)/$(DIR):/home/marp/app/ \
		-e LANG=$(LANG) \
		marp-libreoffice $(FILE) --pptx

run-editable-pptx:
	docker run \
		--rm --init \
		-v $$(pwd)/$(DIR):/home/marp/app/ \
		-e LANG=$(LANG) \
		marp-libreoffice $(FILE) --pptx --pptx-editable
