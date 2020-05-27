<?php

declare(strict_types=1);

namespace GraphQLAPI\GraphQLAPI\Clients;

use PoP\APIEndpointsForWP\EndpointUtils;
use PoP\ComponentModel\ComponentConfiguration as ComponentModelComponentConfiguration;
use PoP\API\Configuration\Request;

abstract class AbstractClient
{
    /**
     * Endpoint
     *
     * @var string
     */
    protected $endpoint;

    abstract protected function getEndpoint(): string;

    /**
     * Initialize the client
     *
     * @return void
     */
    public function initialize(): void
    {
        /**
         * Subject to the endpoint having been defined
         */
        if ($this->endpoint = $this->getEndpoint()) {
            // Make sure the endpoint has trailing "/" on both ends
            $this->endpoint = EndpointUtils::slashURI($this->endpoint);
            /**
             * Register the endpoints
             */
            \add_action(
                'init',
                [$this, 'addRewriteEndpoints']
            );
            \add_filter(
                'query_vars',
                [$this, 'addQueryVar'],
                10,
                1
            );
            /**
             * Process the request to find out if it is any of the endpoints
             */
            \add_action(
                'parse_request',
                [$this, 'parseRequest']
            );
        }
    }

    abstract protected function getVendorDirPath(): string;
    protected function getIndexFilename(): string
    {
        return 'index.html';
    }
    abstract protected function getJSFilename(): string;
    /**
     * HTML to print the client
     *
     * @return string
     */
    public function getClientHTML(): string
    {
        // Read from the static HTML files and replace their endpoints
        $dirPath = $this->getVendorDirPath();
        // Read the file, and return it already
        $file = \GRAPHQL_API_DIR . $dirPath . '/' . $this->getIndexFilename();
        $fileContents = \file_get_contents($file, true);
        // Modify the script path
        $jsFileName = $this->getJSFilename();
        /**
         * Relative asset paths do not work, since the location of the JS/CSS file is
         * different than the URL under which the client is accessed.
         * Then add the URL to the plugin to all assets (they are all located under "assets/...")
         */
        $fileContents = \str_replace(
            '"assets/',
            '"' . \trim(\GRAPHQL_API_URL, '/') . $dirPath . '/assets/',
            $fileContents
        );

        $domain = \getDomain(\fullUrl());
        $endpointURL = $domain . '/api/graphql/';
        if (ComponentModelComponentConfiguration::namespaceTypesAndInterfaces()) {
            $endpointURL = \add_query_arg(Request::URLPARAM_USE_NAMESPACE, true, $endpointURL);
        }
        $fileContents = \str_replace(
            '/' . $jsFileName . '?',
            '/' . $jsFileName . '?endpoint=' . urlencode($endpointURL) . '&',
            $fileContents
        );

        return $fileContents;
    }

    /**
     * Process the request to find out if it is any of the endpoints
     *
     * @return void
     */
    public function parseRequest(): void
    {
        // Check if the URL ends with either /api/graphql/ or /api/rest/ or /api/
        $uri = EndpointUtils::removeMarkersFromURI($_SERVER['REQUEST_URI']);
        if (EndpointUtils::doesURIEndWith($uri, $this->endpoint)) {
            // Print client and exit
            echo $this->getClientHTML();
            die;
        }
    }

    /**
     * Add the endpoints to WordPress
     *
     * @return void
     */
    public function addRewriteEndpoints()
    {
        \add_rewrite_endpoint($this->endpoint, constant('EP_ALL'));
    }

    /**
     * Add the endpoint query vars
     *
     * @param array $query_vars
     * @return void
     */
    public function addQueryVar($query_vars)
    {
        $query_vars[] = $this->endpoint;
        return $query_vars;
    }
}
