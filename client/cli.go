package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	var apiEndpoint string
	var keywords string

	var rootCmd = &cobra.Command{
		Use:   "pdfcli",
		Short: "pdfcli is a tool to use the pdfshare from the console",
		Long:  `pdfcli is a tool to fetch data from the Pdfshare API and perform all the actions from the console`,
		Run: func(cmd *cobra.Command, args []string) {
			if apiEndpoint == "" {
				fmt.Println("Please provide an API endpoint using the -e or --endpoint flag.")
				return
			}

			if keywords == "" {
				fmt.Println("Please provide a keyword using the -k or --keywords flag.")
				return
			}
			// Call the API
			response, err := http.Get(apiEndpoint)
			if err != nil {
				fmt.Printf("Failed to make the API call: %v\n", err)
				return
			}
			defer response.Body.Close()

			body, err := ioutil.ReadAll(response.Body)
			if err != nil {
				fmt.Printf("Failed to read the response body: %v\n", err)
				return
			}

			fmt.Println("API Response:")
			fmt.Println(string(body))
		},
	}

	rootCmd.Flags().StringVarP(&apiEndpoint, "endpoint", "e", "", "API endpoint to call")
	rootCmd.Flags().StringVarP(&keywords, "keywords", "k", "", "Keywords to search for")

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
