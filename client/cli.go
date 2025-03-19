package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"mime/multipart"

	"github.com/spf13/cobra"
	"golang.org/x/term"
)

func Search(query string) (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/search?query=%s", "http://localhost:8087/api", query)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())
	response, err := http.Get(endpoint.String())
	if err != nil {
		fmt.Printf("Search failed: %v\n", err)
		return
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Failed to read result: %v\n", err)
		return
	}

	fmt.Println(string(body))
	return
}

func GetFiles() (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/metadata/files", "http://localhost:8087/api")
	fmt.Printf("Calling endpoint %s\n", endpoint.String())
	response, err := http.Get(endpoint.String())
	if err != nil {
		fmt.Printf("Files fetch failed: %v\n", err)
		return
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("Failed to read result: %v\n", err)
		return
	}

	fmt.Println(string(body))

	return
}

func Login() (result string) {
	var endpoint strings.Builder
	type LoginBody struct {
		username string
		password string
	}

	body := LoginBody{"", ""}

	body.username = os.Getenv("PDFCLI_USERNAME")
	body.password = os.Getenv("PDFCLI_PASSWORD")

	if body.username == "" {
		fmt.Printf("Username:")
		fmt.Scan(&body.username)
	}

	if body.password == "" {
		var passwordArr []byte
		fmt.Printf("Password:")
		passwordArr, err := term.ReadPassword(0)
		if err != nil {
			fmt.Printf("Password insert failed: %v\n", err)
		}
		body.password = string(passwordArr[:])
	}

	fmt.Printf("Usr %s with psw %s", body.username, body.password)

	fmt.Fprintf(&endpoint, "%s/login", "http://localhost:8086/api")
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	response, err := http.Post(endpoint.String(), "application/json", getJsonBody(body))
	if err != nil {
		fmt.Printf("Files fetch failed: %v\n", err)
		return
	}
	defer response.Body.Close()

	return
}

func Upload(fileName string, local bool) {
	var endpoint strings.Builder
	type UploadBody struct {
		file bytes.Buffer
	}
	body := UploadBody{}

	fmt.Fprintf(&endpoint, "%s/extra/upload", "http://localhost:8070/api")
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	osFile, err := os.Open(fileName)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	multipartWriter := multipart.NewWriter(&body.file)
	filePart, _ := multipartWriter.CreateFormFile("file", fileName)
	_, err = io.Copy(filePart, osFile)
	if err != nil {
		fmt.Println("Error copying file content:", err)
		return
	}
	multipartWriter.Close()

	request, _ := http.NewRequest("POST", endpoint.String(), &body.file)
	request.Header.Set("Content-Type", multipartWriter.FormDataContentType())
	client := &http.Client{}
	client.Do(request)

	// fmt.Println(request)
	osFile.Close()
	return
}

func getJsonBody(body any) *bytes.Buffer {
	jsonBody, jsonErr := json.Marshal(body)
	_ = jsonErr

	return bytes.NewBuffer(jsonBody)
}

func main() {
	var apiEndpoint string
	var localFlag bool

	var srchCmd = &cobra.Command{
		Use:     "pdfcli search [query]",
		Aliases: []string{"search"},
		Args:    cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			Search(args[0])
		},
	}

	var filesCmd = &cobra.Command{
		Use:     "pdfcli [files | metadata]",
		Aliases: []string{"files", "metadata"},
		Run: func(cmd *cobra.Command, args []string) {
			GetFiles()
		},
	}

	var loginCmd = &cobra.Command{
		Use:     "pdfcli login",
		Aliases: []string{"login"},
		Run: func(cmd *cobra.Command, args []string) {
			Login()
		},
	}

	var uploadCmd = &cobra.Command{
		Use:     "pdfcli upload <filename> [--local]",
		Aliases: []string{"upload", "up", "send"},
		Run: func(cmd *cobra.Command, args []string) {
			Upload(args[0], localFlag)
		},
	}

	var rootCmd = &cobra.Command{
		Use:   "pdfcli",
		Short: "pdfcli is a tool to use the pdfshare from the console",
		Long:  `pdfcli is a tool to fetch data from the Pdfshare API and perform all the actions from the console`,
		Run: func(cmd *cobra.Command, args []string) {
			// Call the API
			response, err := http.Get(apiEndpoint)
			if err != nil {
				fmt.Printf("Failed to make the API call: %v\n", err)
				return
			}
			defer response.Body.Close()

			body, err := io.ReadAll(response.Body)
			if err != nil {
				fmt.Printf("Failed to read the response body: %v\n", err)
				return
			}

			fmt.Println("API Response:")
			fmt.Println(string(body))
		},
	}

	rootCmd.AddCommand(srchCmd)
	rootCmd.AddCommand(filesCmd)
	rootCmd.AddCommand(loginCmd)
	uploadCmd.Flags().BoolVar(&localFlag, "local", false, "Enable local mode")
	rootCmd.AddCommand(uploadCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
