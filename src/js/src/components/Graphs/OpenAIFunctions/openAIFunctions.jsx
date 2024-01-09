import { Fragment, useEffect } from "react";
import config from "../../../config";

export function OpenAIFunctions() {
  useEffect(() => {
    const backEndAPIPrefix = `${config.apiPrefixForOpenAIFunctionsPage}/api/charts/openaifunctionspage`;

    fetch(`${backEndAPIPrefix}/userSpectra`)
      .then((response) => {
        // Check if the Set-Cookie header is accessible
        // const setCookieHeader = response.headers.get("Set-Cookie");
        // if (setCookieHeader) {
        //   // Set the cookie in the parent document
        //   document.cookie = setCookieHeader;
        //   console.log("Setting Cookie", setCookieHeader);
        // }

        return response.text();
      })
      .then((html) => {
        // Create a temporary element to hold the HTML content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Modify all <link> tags
        const links = tempDiv.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.startsWith("/")) {
            if (href.startsWith("/")) {
              link.setAttribute("href", `${backEndAPIPrefix}${href}`);
            } else {
              link.setAttribute("href", `${backEndAPIPrefix}/${href}`);
            }
          }
        });

        // Modify all <script> tags, if needed
        const scripts = tempDiv.querySelectorAll("script");
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

        // Extract the modified HTML from the temporary element
        const modifiedHtml = tempDiv.innerHTML;

        // Inject the modified HTML into the iframe
        const iframe = document.getElementById("my-iframe");
        iframe.srcdoc = modifiedHtml;
      });
  }, []);

  return (
    <Fragment>
      <h2>Open AI Functions</h2>

      <iframe
        // src={`${config.apiPrefixForOpenAIFunctionsPage}/api/charts/openaifunctionspage/userSpectra`}
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
