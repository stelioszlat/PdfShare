package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"golang.org/x/term"
)

func Search(query string) (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/search?query=%s", "http://localhost:8080/api", query)
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
	fmt.Fprintf(&endpoint, "%s/metadata/files", "http://localhost:8080/api")
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

	fmt.Fprintf(&endpoint, "%s/login", "http://localhost:8080/api")
	fmt.Printf("Calling endpoint %s\n", endpoint.String())
	jsonBody, jsonErr := json.Marshal(body)
	_ = jsonErr

	response, err := http.Post(endpoint.String(), "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		fmt.Printf("Files fetch failed: %v\n", err)
		return
	}
	defer response.Body.Close()

	return
}

func main() {
	var apiEndpoint string

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

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
