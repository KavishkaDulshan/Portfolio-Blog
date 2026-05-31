<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #d1d5db;
            background-color: #111827;
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
          }
          table {
            border: none;
            border-collapse: collapse;
            width: 100%;
            margin-top: 1rem;
          }
          th {
            text-align: left;
            padding: 12px 10px;
            font-size: 12px;
            border-bottom: 2px solid #374151;
            color: #9ca3af;
            text-transform: uppercase;
          }
          td {
            padding: 12px 10px;
            border-bottom: 1px solid #1f2937;
          }
          a {
            color: #60a5fa;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
            color: #93c5fd;
          }
          .desc {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #1f2937;
            border-radius: 8px;
            border: 1px solid #374151;
          }
          h1 {
            color: #f3f4f6;
          }
          .alternates {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
          }
          .alternates a {
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <div class="desc">
          <p>This is a standard XML sitemap generated for search engines.</p>
          <p>It contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Priority</th>
              <th>Freq</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  <xsl:if test="xhtml:link">
                    <div class="alternates">
                      Translations: 
                      <xsl:for-each select="xhtml:link">
                        <a href="{@href}"><xsl:value-of select="translate(@hreflang, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/></a>
                        <xsl:if test="position() != last()">, </xsl:if>
                      </xsl:for-each>
                    </div>
                  </xsl:if>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
