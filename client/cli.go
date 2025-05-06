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

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"golang.org/x/term"
)

type User struct {
	Username  string `json:"username,omitempty"`
	Email     string `json:"email,omitempty"`
	Active    bool   `json:"active,omitempty"`
	IsAdmin   bool   `json:"isAdmin,omitempty"`
	LastLogin string `json:"lastLogin,omitempty"`
	ApiToken  string `json:"apiToken,omitempty"`
}

type Keyword struct {
	Word  string `json:"word,omitempty"`
	Count int    `json:"count,omitempty"`
}

type File struct {
	Id           string    `json:"_id,omitempty`
	FileName     string    `json:"fileName,omitempty"`
	DownloadLink string    `json:"downloadLink,omitempty"`
	Author       string    `json:"author,omitempty"`
	Uploader     string    `json:"uploader,omitempty"`
	TimesQueried int       `json:"timesQueried,omitempty"`
	Version      int       `json:"version,omitempty"`
	Keywords     []Keyword `json:"keywords,omitempty"`
}

type UsersResponse struct {
	Users   []User `json:"users,omitempty`
	Message string `json:"message,omitempty"`
}

type FilesResponse struct {
	Files   []File `json:"files,omitempty"`
	Message string `json:"message,omitempty"`
}

type LoginResponse struct {
	Accesstoken string `json:"access_token,omitempty"`
	IsAdmin     bool   `json:"isAdmin,omitempty"`
	UserId      string `json:"userId,omitempty"`
	Message     string `json:"message,omitempty"`
}

func GetUsers(token string) (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/user/all", "http://localhost:8086/api")
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	req, err := http.NewRequest("GET", endpoint.String(), nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Authorization", "Bearer "+token)

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	var jsonResponse UsersResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		fmt.Printf("Error: %s\n", jsonError.Error())
	}

	for _, element := range jsonResponse.Users {
		fmt.Println(element.Username)
	}

	return
}

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

	var jsonResponse FilesResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		fmt.Printf("Error: %s\n", jsonError.Error())
	}

	for _, element := range jsonResponse.Files {
		fmt.Println(element.FileName + element.DownloadLink)
	}

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

	var jsonResponse FilesResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		fmt.Printf("Error: %s\n", jsonError.Error())
	}

	for _, element := range jsonResponse.Files {
		fmt.Printf("%s by %s shown %d times\n", element.FileName, element.Uploader, element.TimesQueried)
	}

	return
}

func Login() (result string) {
	var endpoint strings.Builder

	body := map[string]string{
		"username": "",
		"password": "",
	}

	var username []byte
	fmt.Printf("Username:")
	fmt.Scan(&username)
	body["username"] = string(username)

	var passwordArr []byte
	fmt.Printf("Password:")
	passwordArr, err := term.ReadPassword(0)
	if err != nil {
		fmt.Printf("Password insert failed: %v\n", err)
	}
	body["password"] = string(passwordArr[:])

	fmt.Println("Login as user ", body["username"])

	fmt.Fprintf(&endpoint, "%s/auth/login", "http://localhost:8086/api")
	fmt.Println("Calling endpoint ", endpoint.String())

	response, err := http.Post(endpoint.String(), "application/json", getJsonBody(body))
	if err != nil {
		fmt.Printf("Login failed: %v\n", err)
		return
	}

	var jsonResponse LoginResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		fmt.Printf("Error: %s\n", jsonError.Error())
	}

	if jsonResponse.Accesstoken != "" {
		fmt.Println("\nCopy this token to call the API on your own!\n")
		fmt.Println(jsonResponse.Accesstoken)

		setAccessToken(jsonResponse.Accesstoken)
	} else {
		fmt.Println(jsonResponse.Message)

		if jsonResponse.Message == "Incorrect password" {
			return Login()
		}
	}

	defer response.Body.Close()
	return jsonResponse.Accesstoken
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
}

func getAccessToken() string {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	accessToken := os.Getenv("PDFCLI_TOKEN")
	if accessToken == "" {
		return Login()
	}

	return accessToken
}

func setAccessToken(token string) {
	f, err := os.Create(".env")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	f.WriteString("PDFCLI_TOKEN=" + token)
}

func authenticate() *string {
	token := getAccessToken()
	if token != "" {
		return &token
	}

	os.Exit(0)
	return nil
}

func getJsonBody(body any) *bytes.Buffer {
	jsonBody, _ := json.Marshal(body)
	requestBody := bytes.NewBuffer(jsonBody)

	return requestBody
}

func main() {
	var apiEndpoint string
	var localFlag bool

	var usrCmd = &cobra.Command{
		Use:   "users",
		Short: "Get the users",
		Run: func(cmd *cobra.Command, args []string) {
			token := authenticate()
			if token != nil {
				GetUsers(*token)
			}
		},
	}

	var srchCmd = &cobra.Command{
		Use:   "search [query]",
		Short: "Search for a file",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			if authenticate() != nil {
				Search(args[0])
			}
		},
	}

	var filesCmd = &cobra.Command{
		Use:   "files",
		Short: "Get a list of the files registered",
		Run: func(cmd *cobra.Command, args []string) {
			if authenticate() != nil {
				GetFiles()
			}
		},
	}

	var loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Login with your credentials",
		Run: func(cmd *cobra.Command, args []string) {
			Login()
		},
	}

	var uploadCmd = &cobra.Command{
		Use:     "upload <filename> [--local]",
		Short:   "Upload file locally or on the cloud",
		Aliases: []string{"up", "send"},
		Run: func(cmd *cobra.Command, args []string) {
			getAccessToken()
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

	rootCmd.AddCommand(usrCmd)
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
