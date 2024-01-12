import { Fragment, useEffect, useRef } from "react";
import config from "../../../config";

export function OpenAIFunctions() {
  const iframe = useRef();
  const backEndAPIPrefix = `${config.apiPrefixForOpenAIFunctionsPage}/api/charts/openaifunctionspage`;
  function mySubmitFunction(e) {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);

    // Append the new 'save' field to the FormData
    // Assuming '1' is the value you want to send when the form is submitted
    formData.append("save", "Save");

    fetch(`${backEndAPIPrefix}/performSelectSpectra`, {
      method: "POST",
      body: formData, // send the form data
      credentials: "include", // include credentials/cookies in the request
      headers: {
        // POST: "/performSelectSpectra HTTP/1.1",
        // Pragma: "no-cache",
        // "Cache-Control": "no-cache",
        // "Upgrade-Insecure-Requests": "1",
        // "User-Agent":
        //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
        // Origin: "http://10.10.18.121:1900",
        // Do not set 'Content-Type' here for FormData. Browser will set it correctly.
        // Accept:
        //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        // Referer: "http://10.10.18.121:1900/dynamicPageSpectra/userSpectra",
        // "Accept-Encoding": "gzip, deflate",
        // "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
      },
    })
      .then((response) => response.json()) // or response.text() if your server returns text
      .then((data) => {
        // Handle success - update UI or notify user
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors - show error message or notification
      });
  }

  useEffect(() => {
    fetch(`${backEndAPIPrefix}/userSpectra`)
      .then((response) => {
        // Check if the Set-Cookie header is accessible
        // const setCookieHeader = response.headers.get("Set-Cookie");
        // if (setCookieHeader) {
        //   // Set the cookie in the parent document
        //   document.cookie = setCookieHeader;
        // }

        return response.text();
      })
      .then((html) => {
        // Parse the HTML string into a new Document
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Modify all <link> tags
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.startsWith("/")) {
            link.setAttribute("href", `${backEndAPIPrefix}${href}`);
          }
        });

        // Modify all <script> tags, if needed
        const scripts = doc.querySelectorAll("script");
        scripts.forEach((script) => {
          const src = script.getAttribute("src");
          if (src) {
            if (src.startsWith("/")) {
              script.setAttribute("src", `${backEndAPIPrefix}${src}`);
            } else {
              script.setAttribute("src", `${backEndAPIPrefix}/${src}`);
            }
          }
        });

        // Modify the form's action attribute
        const form = doc.querySelector('form[name="createForm"]');
        if (form) {
          form.removeAttribute("action");
          form.removeAttribute("method");
          // form.setAttribute("action", mySubmitFunction);
        }

        // Create a new link element for Font Awesome and add it to the head
        const fontAwesomeLink = document.createElement("link");
        fontAwesomeLink.rel = "stylesheet";
        fontAwesomeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        fontAwesomeLink.integrity =
          "sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==";
        fontAwesomeLink.crossOrigin = "anonymous";
        doc.head.appendChild(fontAwesomeLink);

        // Serialize the modified document back to a string
        const modifiedHtml = doc.documentElement.outerHTML;

        if (iframe.current) {
          // Inject the modified HTML into the iframe
          iframe.current.srcdoc = modifiedHtml;

          // Wait for the iframe to load the content
          iframe.current.onload = () => {
            // Access the iframe's document
            const iframeDocument = iframe.current.contentWindow.document;

            // Find the form inside the iframe
            const formInsideIframe = iframeDocument.querySelector(
              'form[name="createForm"]'
            );
            if (formInsideIframe) {
              // Remove the action and method attributes
              formInsideIframe.removeAttribute("action");
              formInsideIframe.removeAttribute("method");

              // Attach the submit event handler
              formInsideIframe.onsubmit = mySubmitFunction;
            }
          };
        }
      });
  }, []);

  //   useEffect(() => {
  //     iframe.current.srcdoc = html;
  //   }, [code]);

  return (
    <Fragment>
      <iframe
        // src={`${config.apiPrefixForOpenAIFunctionsPage}/api/charts/openaifunctionspage/userSpectra`}
        ref={iframe}
        id="my-iframe"
        width="98%"
        height="860"
        style={{
          border: "1px solid black",
        }}
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </Fragment>
  );
}
