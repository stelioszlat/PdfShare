package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"mime/multipart"

	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	"golang.org/x/term"
)

type User struct {
	Username  string `json:"username,omitempty"`
	Email     string `json:"email,omitempty"`
	Active    bool   `json:"isActive,omitempty"`
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

type UploadBody struct {
	file bytes.Buffer
}

var apiUrl string
var authAPIUrl string
var extraAPIUrl string

func GetUsers(token string) (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/user/all", authAPIUrl)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	req, err := http.NewRequest("GET", endpoint.String(), nil)
	if err != nil {
		handleError(err)
	}
	req.Header.Add("Authorization", "Bearer "+token)

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		handleError(err)
	}
	defer response.Body.Close()

	var jsonResponse UsersResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		handleError(err)
	}

	for _, element := range jsonResponse.Users {
		var userActivity string = ""
		if element.Active {
			userActivity = "active"
		} else {
			userActivity = "inactive"
		}
		fmt.Printf("User %s with e-mail %s is currently %s \n", element.Username, element.Email, userActivity)
	}

	return
}

func Search(query string) (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/search?query=%s", apiUrl, query)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())
	response, err := http.Get(endpoint.String())
	if err != nil {
		handleError(err)
	}
	defer response.Body.Close()

	var jsonResponse FilesResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		handleError(jsonError)
	}

	for _, element := range jsonResponse.Files {
		fmt.Println(element.FileName + element.DownloadLink)
	}

	return
}

func GetFiles() (result string) {
	var endpoint strings.Builder
	fmt.Fprintf(&endpoint, "%s/metadata/files", apiUrl)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())
	response, err := http.Get(endpoint.String())
	if err != nil {
		handleError(err)
	}
	defer response.Body.Close()

	var jsonResponse FilesResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		handleError(err)
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
		handleError(err)
	}
	body["password"] = string(passwordArr[:])

	fmt.Println("Login as user ", body["username"])

	fmt.Fprintf(&endpoint, "%s/auth/login", authAPIUrl)
	fmt.Println("Calling endpoint ", endpoint.String())

	response, err := http.Post(endpoint.String(), "application/json", getJsonBody(body))
	if err != nil {
		handleError(err)
	}

	var jsonResponse LoginResponse
	responseBody, _ := io.ReadAll(response.Body)
	jsonError := json.Unmarshal(responseBody, &jsonResponse)

	if jsonError != nil {
		handleError(jsonError)
	}

	if jsonResponse.Accesstoken != "" {
		fmt.Println("\nCopy this token to call the API on your own!")
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

	fmt.Fprintf(&endpoint, "%s/extra/upload", extraAPIUrl)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	osFile, err := os.Open(fileName)
	if err != nil {
		handleError(err)
	}

	multipartWriter := multipart.NewWriter(&body.file)
	filePart, _ := multipartWriter.CreateFormFile("file", fileName)
	_, err = io.Copy(filePart, osFile)
	if err != nil {
		handleError(err)
	}
	multipartWriter.Close()

	request, _ := http.NewRequest("POST", endpoint.String(), &body.file)
	request.Header.Set("Content-Type", multipartWriter.FormDataContentType())
	client := &http.Client{}
	client.Do(request)

	// fmt.Println(request)
	osFile.Close()
}

func Sync(dir string, local bool) {
	var endpoint strings.Builder
	type UploadBody struct {
		file bytes.Buffer
	}
	body := UploadBody{}
	var files []string

	fmt.Println("Searching files in directory " + dir)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && strings.HasSuffix(strings.ToLower(info.Name()), ".pdf") {
			files = append(files, path)
			fmt.Println("Found: " + path)
		}

		return nil
	})

	if err != nil {
		handleError(err)
	}

	if len(files) == 0 {
		fmt.Println("No .pdf files found on this directory")
		os.Exit(1)
	}

	fmt.Fprintf(&endpoint, "%s/extra/upload", extraAPIUrl)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	for _, fileName := range files {

		osFile, err := os.Open(fileName)
		if err != nil {
			handleError(err)
		}

		multipartWriter := multipart.NewWriter(&body.file)
		filePart, _ := multipartWriter.CreateFormFile("file", fileName)
		_, err = io.Copy(filePart, osFile)
		if err != nil {
			handleError(err)
		}
		multipartWriter.Close()

		request, _ := http.NewRequest("POST", endpoint.String(), &body.file)
		request.Header.Set("Content-Type", multipartWriter.FormDataContentType())
		client := &http.Client{}
		client.Do(request)

		// fmt.Println(request)
		osFile.Close()
	}
}

func Download(fileName string) {
	var endpoint strings.Builder

	encodedFileName := url.QueryEscape(fileName)

	fmt.Fprintf(&endpoint, "%s/extra/download&file=%s", extraAPIUrl, encodedFileName)
	fmt.Printf("Calling endpoint %s\n", endpoint.String())

	response, err := http.Get(endpoint.String())
	if err != nil {
		handleError(err)
	}
	defer response.Body.Close()

}

func handleError(err error) {
	fmt.Printf("Error: %s\n", err.Error())
	os.Exit(-1)
}

func getAccessToken() string {
	err := godotenv.Load()
	if err != nil {
		handleError(err)
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
		handleError(err)
	}
	defer f.Close()

	f.WriteString("PDFCLI_TOKEN=" + token)
}

func loadAPIUrl(isServerless bool) {
	if isServerless {
		apiUrl = "http://localhost:3000/dev"
		authAPIUrl = "http://localhost:3000/dev"
		extraAPIUrl = "http://localhost:3000/dev"
	} else {
		apiUrl = "http://localhost:8087/api"
		authAPIUrl = "http://localhost:8060/api"
		extraAPIUrl = "http://localhost:8070/api"
	}
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
	var localFlag bool
	var isServerless bool

	var usrCmd = &cobra.Command{
		Use:   "users",
		Short: "Get the users",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
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
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			if authenticate() != nil {
				Search(args[0])
			}
		},
	}

	var filesCmd = &cobra.Command{
		Use:   "files",
		Short: "Get a list of the files registered",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			if authenticate() != nil {
				GetFiles()
			}
		},
	}

	var loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Login with your credentials",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			Login()
		},
	}

	var uploadCmd = &cobra.Command{
		Use:     "upload <filename> [--local]",
		Short:   "Upload file locally or on the cloud",
		Aliases: []string{"up", "send"},
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			getAccessToken()
			Upload(args[0], localFlag)
		},
	}

	var syncCmd = &cobra.Command{
		Use:   "sync [--local]",
		Short: "Sync all local .pdf files locally or on the cloud",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			var dir string = "./"
			if len(args) != 0 {
				dir = args[0]
			}
			Sync(dir, localFlag)
		},
	}

	var downloadCmd = &cobra.Command{
		Use:     "download <file>",
		Short:   "Download a file from the cloud",
		Aliases: []string{"get"},
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			Download(args[0])
		},
	}

	var rootCmd = &cobra.Command{
		Use:   "pdfcli",
		Short: "pdfcli is a tool to use the pdfshare from the console",
		Long:  `pdfcli is a tool to fetch data from the Pdfshare API and perform all the actions from the console`,
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			loadAPIUrl(isServerless)
		},
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Help()
		},
	}

	rootCmd.AddCommand(usrCmd)
	rootCmd.AddCommand(srchCmd)
	rootCmd.AddCommand(filesCmd)
	rootCmd.AddCommand(loginCmd)
	uploadCmd.Flags().BoolVar(&localFlag, "local", false, "Enable local mode")
	rootCmd.AddCommand(uploadCmd)
	syncCmd.Flags().BoolVar(&localFlag, "local", false, "Enable local mode")
	rootCmd.AddCommand(syncCmd)
	rootCmd.AddCommand(downloadCmd)
	rootCmd.PersistentFlags().BoolVarP(&isServerless, "serverless", "s", false, "Run on serverless API")

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
