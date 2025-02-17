// export function NumberField({ id }) {
// 	const inputRef = useRef();

// 	function applyMarkup(tagName) {
// 		const selection = document.getSelection();

// 		const anchorNode = selection.anchorNode;
// 		const anchorOffset = selection.anchorOffset;
// 		const anchorText = anchorNode?.textContent;

// 		const focusNode = selection.focusNode;
// 		const focusOffset = selection.focusOffset;
// 		const focusText = focusNode?.textContent;

// 		const startOffset = Math.min(anchorOffset, focusOffset);
// 		const endOffset = Math.max(anchorOffset, focusOffset);

// 		const markupText = anchorText.slice(startOffset, endOffset);

// 		const preMarkupText = anchorText.slice(0, startOffset);
// 		const preMarkupNode = document.createTextNode(preMarkupText);

// 		const postMarkupText = anchorText.slice(endOffset, anchorText.length);
// 		const postMarkupNode =
// 			postMarkupText.length > 0
// 				? document.createTextNode(postMarkupText)
// 				: document.createTextNode(" ");

// 		let markupElem = null;

// 		if (selection.isCollapsed) return;

// 		// return early if multiple elements selected
// 		if (anchorText !== focusText) {
// 			console.log("text content does not match");
// 			return;
// 		}

// 		markupElem = document.createElement(tagName);
// 		markupElem.textContent = markupText;

// 		document.getElementById(id).normalize();

// 		anchorNode.replaceWith(preMarkupNode);
// 		preMarkupNode.after(markupElem);
// 		markupElem.after(postMarkupNode);

// 		setNewSelection(markupElem.firstChild, selection, 0, markupText.length);
// 	}

// 	function clearField() {
// 		const elem = document.getElementById(id);
// 		elem.innerHTML = "";
// 		elem.focus();
// 	}

// 	function handleKeyDown(e) {
// 		const selection = document.getSelection();
// 		const anchorNode = selection.anchorNode;
// 		const anchorOffset = selection.anchorOffset;
// 		const anchorText = anchorNode?.textContent;

// 		switch (e.code) {
// 			case "Enter": {
// 				e.preventDefault();
// 				return;
// 			}
// 			case "KeyX": {
// 				if (anchorNode.nodeType === 3) {
// 					const preText = anchorText.slice(0, anchorOffset);
// 					const postText = anchorText.slice(anchorOffset, anchorText.length);

// 					const updatedText = preText + "×" + postText;
// 					const newTextNode = document.createTextNode(updatedText);
// 					const newPos = anchorOffset + 1;

// 					e.preventDefault();
// 					anchorNode.replaceWith(newTextNode);
// 					setNewSelection(newTextNode, selection, newPos, newPos);
// 					return;
// 				}
// 				return;
// 			}
// 			case "Minus": {
// 				if (e.shiftKey) {
// 					return;
// 				}

// 				if (anchorNode.nodeType === 3) {
// 					const preText = anchorText.slice(0, anchorOffset);
// 					const postText = anchorText.slice(anchorOffset, anchorText.length);

// 					const updatedText = preText + "–" + postText;
// 					const newTextNode = document.createTextNode(updatedText);
// 					const newPos = anchorOffset + 1;

// 					e.preventDefault();
// 					anchorNode.replaceWith(newTextNode);
// 					setNewSelection(newTextNode, selection, newPos, newPos);
// 					return;
// 				}

// 				return;
// 			}
// 			case "Space": {
// 				const preCaretText = anchorText.slice(0, anchorOffset);

// 				const match = matchSuperscript(preCaretText);

// 				let markupText = "";
// 				let preMarkupText = "";
// 				let postMarkupText = "";
// 				let markupElem = null;
// 				let preMarkupNode = null;
// 				let postMarkupNode = null;
// 				let length = 0;

// 				if (!match) return;

// 				if (match) {
// 					markupElem = document.createElement("sup");
// 					markupText = match[1];
// 					preMarkupText = preCaretText.slice(0, match.index); // text before the "^"
// 				}

// 				markupElem.textContent = markupText;
// 				preMarkupNode = document.createTextNode(preMarkupText);
// 				postMarkupText = anchorText.slice(anchorOffset, anchorText.length); // text after caret
// 				postMarkupNode =
// 					postMarkupText.length > 0
// 						? document.createTextNode(postMarkupText)
// 						: document.createTextNode(" ");

// 				e.preventDefault();
// 				document.getElementById(id).normalize();

// 				anchorNode.replaceWith(preMarkupNode);
// 				preMarkupNode.after(markupElem);
// 				markupElem.after(postMarkupNode);
// 				length = markupText.length;
// 				setNewSelection(markupElem.firstChild, selection, length, length);

// 				return;
// 			}

// 			default:
// 				return;
// 		}
// 	}

// 	function handleInsert(textFrag, startOffset, endOffset) {
// 		const selection = document.getSelection();
// 		const anchorNode = selection?.anchorNode;
// 		const focusNode = selection?.focusNode;
// 		const anchorOffset = selection?.anchorOffset;
// 		const focusOffset = selection?.focusOffset;
// 		const parentElem = anchorNode?.parentElement;

// 		if (anchorNode.id === id && !anchorNode.textContent) {
// 			const updatedText = textFrag;
// 			const newTextNode = document.createTextNode(updatedText);
// 			anchorNode.appendChild(newTextNode);

// 			anchorNode.children[0]?.tagName === "BR"
// 				? anchorNode.children[0].remove()
// 				: null;

// 			setNewSelection(newTextNode, selection, startOffset, endOffset);
// 			return;
// 		}

// 		// prevent insertion if selection within <sup> element
// 		if (parentElem?.id !== id) {
// 			return;
// 		}

// 		if (anchorNode.textContent === focusNode.textContent) {
// 			const anchorText = anchorNode?.textContent || "";
// 			const preCaretText = anchorText.slice(0, anchorOffset);
// 			const postCaretText = anchorText.slice(focusOffset, anchorText.length);
// 			const updatedText = preCaretText + textFrag + postCaretText;
// 			const caretStart = preCaretText.length + startOffset;
// 			const caretEnd = preCaretText.length + endOffset;
// 			const newTextNode = document.createTextNode(updatedText);

// 			anchorNode.replaceWith(newTextNode);
// 			setNewSelection(newTextNode, selection, caretStart, caretEnd);
// 			return;
// 		}
// 	}

// 	return (
// 		<div>
// 			<div style={{ paddingBottom: "2px" }}>
// 				<IconButton
// 					sx={{ color: "dimgray" }}
// 					onClick={() => applyMarkup("sup")}
// 				>
// 					<SuperscriptIcon />
// 				</IconButton>
// 				<span
// 					style={{
// 						marginLeft: "30px",
// 						marginRight: "15px",
// 						fontSize: "20px",
// 						color: "gainsboro",
// 					}}
// 				>
// 					|
// 				</span>
// 				<span style={{ display: "inline-block", width: "10px" }}></span>
// 				<Button
// 					onClick={() => handleInsert("ln( )", 3, 4)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					ln &#40; &#41;
// 				</Button>
// 				<Button
// 					onClick={() => handleInsert("sin( )", 4, 5)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					sin &#40; &#41;
// 				</Button>
// 				<Button
// 					onClick={() => handleInsert("cos( )", 4, 5)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					cos &#40; &#41;
// 				</Button>
// 				<Button
// 					onClick={() => handleInsert("tan( )", 4, 5)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					tan &#40; &#41;
// 				</Button>
// 				<Button
// 					onClick={() => handleInsert("π", 1, 1)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					π
// 				</Button>
// 				<Button
// 					onClick={() => handleInsert("°", 1, 1)}
// 					sx={{ color: "dimgray", textTransform: "none" }}
// 				>
// 					°
// 				</Button>
// 			</div>
// 			<div className="electron-config-field-container">
// 				<div
// 					ref={inputRef}
// 					id={id}
// 					className="electron-config-field"
// 					contentEditable
// 					onKeyDown={handleKeyDown}
// 				></div>
// 				<div className="clear-field-btn-container">
// 					<button
// 						className="clear-field-btn hover-pointer"
// 						onClick={clearField}
// 					>
// 						clear
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
