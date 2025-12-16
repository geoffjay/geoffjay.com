package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	log.Info("health check - test")
	fmt.Fprintf(w, "OK")
}

func main() {
	http.HandleFunc("/health-check", healthCheckHandler)
	http.ListenAndServe(":9080", nil)
}
