customElements.define(
  'code-demo',
  class extends HTMLElement {
    constructor() {
      super()
    }

    css = `
			code-demo {
				background: #1e1e1e;
				border: 1px solid rgba(125,125,125,0.5);
				border-radius: 1rem;
				display: block;
				margin: 1rem 0;
				overflow: hidden;
			}
			nav {
				display: flex;
				justify-content: space-between;
				padding: 12px;
			}
			nav select {
				background: transparent;
				border: 0;
				color: #bbb;
			}
			nav label {
				color: white;
				font-size: 13px;
			}
			.playground-grid {
				display: flex;
				overflow: hidden;
			}
			.playground-container {
				display: grid;
				flex-basis: 50%;
			}
			.playground {
				aspect-ratio: 4/3;
				width: 100%;
				height: 100%;
				overflow: hidden;
			}
			@media(max-width: 720px) {
				.playground-grid {
					flex-direction: column;
				}
				.playground {
					aspect-ratio: 2/1;
				}
			}
			iframe {
				border: 0;
				box-shadow: 0 0 15px #1e1e1e;
				display: block;
				flex-basis: 50%;
				z-index: 5;
			}
			.mtk1 {
				color: #52adf2 !important;
			}
			.mtk8 {
				color: #d55fde !important;
			}
			.mtk4,
			.mtk6 {
				color: #d8985f !important;
			}
			.mtk5 {
				color: #89ca78 !important;
			}
			.mtk7 {
				color: #5c6370 !important;
			}
			.mtk9,
			.mtk10 {
				color: #bbbbbb !important;
			}
			.mtk12,
			.mtk22 {
				color: #e5c07b !important;
			}
			.mtk14 {
				color: #52adf2 !important;
			}
			.mtk18 {
				color: #d55fde !important;
			}
		`

    setupEnvironment() {
      this.code = {}
      const comments = [...this.childNodes].filter(
        (node) => node.nodeType === 8
      )

      comments.forEach((comment) => {
        const content = comment.data.trim().split('\n')
        const type = content[0]
        content.shift()
        this.code[type] = content.join('\n')
      })

      const langs = Object.keys(this.code).length > 1
      const label = this.getAttribute('label')

      this.innerHTML = `
				<style>${this.css}</style>
				<div class="playground-grid">
					<div class="playground-container">
						${
              langs || label
                ? `
									<nav>
										${label ? `<label>${label}</label>` : ''}
										${
                      langs
                        ? `
													<select>
														${Object.keys(this.code).map((lang) => `<option>${lang}</option>`)}
													</select>
													`
                        : ''
                    }
									</nav>
									`
                : ''
            }
						<div class="playground"></div>
					</div>
					<iframe ref="iframe"></iframe>
				</div>
			`

      this.playground = this.querySelector('.playground')
      this.iframe = this.querySelector('iframe')
      this.loadMonaco(Object.keys(this.code)[0])
      this.setFrame()

      this.codeSwitcher = this.querySelector('select')
      this?.codeSwitcher.addEventListener('change', (e) => {
        this.editor.getModel().dispose()
        this.editor.dispose()
        this.loadMonaco(e.target.value)
      })
    }

    setFrame() {
      this.iframe.srcdoc = `
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				>
				${this.code.css ? `<style>${this.code.css}</style>` : ''}
				${this.code?.html}
				${
          this.code.javascript
            ? `<script type="module">${this.code.javascript}</script>`
            : ''
        }
				${
          this.code.babel
            ? `
							<script
								src="https://unpkg.com/@babel/standalone/babel.min.js"
							></script>
							<script type="text/babel" data-type="module">
								${this.code.babel}
							</script>
							`
            : ''
        }
			`
    }

    loadMonaco(lang) {
      import('https://cdn.skypack.dev/@monaco-editor/loader@1.3.2').then(
        (loader) => {
          loader.default.init().then((monaco) => {
            this.editor = monaco.editor.create(this.playground, {
              automaticLayout: true,
              folding: false,
              fontSize: '11px',
              language: lang === 'babel' ? 'javascript' : lang,
              lineHeight: 2,
              lineNumbers: 'off',
              minimap: {
                enabled: false,
              },
              roundedSelection: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              theme: 'vs-dark',
              value: this.code[lang],
              lineDecorationsWidth: 12,
            })
            this.editor.onDidChangeModelContent(() => {
              this.code[lang] = this.editor.getValue()
              this.setFrame()
            })
          })
        }
      )
    }

    connectedCallback() {
      this.setupEnvironment()
    }
  }
)
