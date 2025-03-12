pdfcli: cli.go go.mod
	go build -o pdfcli

test: pdfcli
	./pdfcli 

search: pdfcli
	./pdfcli search protocol

files: pdfcli
	./pdfcli files
	./pdfcli metadata

login: pdfcli
	./pdfcli login 

reload: clean pdfcli

clean:
	rm pdfcli

	
