import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import React, {useState} from "react";
import {gql} from "apollo-boost";
import {UrlAvailabilityStatus} from "./UrlAvailabilityStatus";
import {useMutation} from "@apollo/react-hooks";
import {CreatePasteStatus} from "./CreatePasteStatus";
import {Redirect} from "react-router-dom";

function renderTooltip(props) {
    return (
        <Tooltip id="button-tooltip" {...props}>
            Your paste may be deleted before its expiration time.<br/>It depends on memory availability on our database
            servers.<br/>"Max" means we'll try to store your paste as long as possible.
        </Tooltip>
    );
}

const CREATE_PASTE = gql`
    mutation CreatePaste($text: String!, $title: String, $isPublic: Boolean, $url: String, $language: String, $expiresAfter: Int) {
        createPaste(pasteInput: {
            text: $text,
            title: $title,
            isPublic: $isPublic,
            url: $url,
            language: $language,
            expiresAfter: $expiresAfter
        }) {
            createdAt
            text
            url
            title
            isPublic
        }
    }
`;

const GET_RECENT_PASTES = gql`
    query GetRecentPastes($count: Int!) {
        getRecentPastes(count: $count) {
            createdAt
            text
            url
            title
        }
    }
`;

const useCreatePasteForm = (callback) => {
    const [inputs, setInputs] = useState({
        text: "",
        title: "",
        url: "",
        language: "",
        expiresAfter: (60 * 60).toString(),
        isPublic: true
    });
    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (callback) {
            callback();
        }
    };
    const handleInputChange = (e) => {
        //event.persist();
        const target = e.target;
        let value = target.name === 'isPublic' ? target.checked : target.value;
        const name = target.name;

        if (name === 'url') {
            value = value.replace(/[^a-z0-9_-]/i, '');
        }

        if (name === 'url' || name === 'title') {
            value = value.substring(0, 129);
        }

        if (name === 'text') {
            value = value.substring(0, 4097);
        }

        setInputs(inputs => ({...inputs, [name]: value}));
    };
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
};

/*
createPaste = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const [createPaste, { data, loading, error }] = useMutation(CREATE_PASTE);
        createPaste({
            variables: {...this.state.paste}
        }).then(result => console.log(result));
        this.setState({
            data, loading, error
        });
    };
 */

const languages = ["abap", "abnf", "actionscript", "ada", "apacheconf", "apl", "applescript", "arduino", "arff", "asciidoc", "asm6502", "aspnet", "autohotkey", "autoit", "bash", "basic", "batch", "bison", "bnf", "brainfuck", "bro", "c", "cil", "clike", "clojure", "cmake", "coffeescript", "cpp", "crystal", "csharp", "csp", "css-extras", "css", "d", "dart", "diff", "django", "dns-zone-file", "docker", "ebnf", "eiffel", "ejs", "elixir", "elm", "erb", "erlang", "flow", "fortran", "fsharp", "gcode", "gedcom", "gherkin", "git", "glsl", "gml", "go", "graphql", "groovy", "haml", "handlebars", "haskell", "haxe", "hcl", "hpkp", "hsts", "http", "ichigojam", "icon", "inform7", "ini", "io", "j", "java", "javadoc", "javadoclike", "javascript", "javastacktrace", "jolie", "jq", "js-extras", "js-templates", "jsdoc", "json", "json5", "jsonp", "jsx", "julia", "keyman", "kotlin", "latex", "less", "lilypond", "liquid", "lisp", "livescript", "lolcode", "lua", "makefile", "markdown", "markup-templating", "markup", "matlab", "mel", "mizar", "monkey", "n1ql", "n4js", "nand2tetris-hdl", "nasm", "nginx", "nim", "nix", "nsis", "objectivec", "ocaml", "opencl", "oz", "parigp", "parser", "pascal", "pascaligo", "pcaxis", "perl", "php-extras", "php", "phpdoc", "plsql", "powershell", "processing", "prolog", "properties", "protobuf", "pug", "puppet", "pure", "python", "q", "qore", "r", "reason", "regex", "renpy", "rest", "rip", "roboconf", "ruby", "rust", "sas", "sass", "scala", "scheme", "scss", "shell-session", "smalltalk", "smarty", "soy", "splunk-spl", "sql", "stylus", "swift", "t4-cs", "t4-templating", "t4-vb", "tap", "tcl", "textile", "toml", "tsx", "tt2", "twig", "typescript", "vala", "vbnet", "velocity", "verilog", "vhdl", "vim", "visual-basic", "wasm", "wiki", "xeora", "xojo", "xquery", "yaml"];


function NewPasteForm(props) {
    let [isUrlValid, setUrlValid] = useState(true);
    const [createPaste, { data, loading, error }] = useMutation(CREATE_PASTE, {
        update(cache, { data: { createPaste } }) {
            let pastes = cache.readQuery({ query: GET_RECENT_PASTES, variables: {count: 9}}).getRecentPastes;
            if (!createPaste.isPublic) return;
            if (pastes.length === 9) {
                pastes.pop();
            }
            pastes.unshift(createPaste);
            cache.writeQuery({
                query: GET_RECENT_PASTES,
                data: { getRecentPastes: pastes },
            });
        }
    });
    const {handleSubmit, handleInputChange, inputs} = useCreatePasteForm(() => {
        let preparedInputs = {...inputs};
        for (let name in preparedInputs) {
            if (!preparedInputs.hasOwnProperty(name)) {
                continue;
            }
            if (!preparedInputs[name]) {
                preparedInputs[name] = null;
            }
        }
        preparedInputs.expiresAfter = Number.parseInt(preparedInputs.expiresAfter);
        createPaste({
            variables: preparedInputs
        }).then(result => console.log("RESULT:::", result)).catch(() => {});
    });

    return (
        <Form onSubmit={handleSubmit}>
            {data?.createPaste.url && <Redirect to={data.createPaste.url}/>}
            <Form.Group controlId="paste.Text">
                <Form.Label>Paste text</Form.Label>
                <Form.Control as="textarea" rows="15" name="text"
                              value={inputs.text}
                              onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="paste.Title">
                <Form.Label>Paste title</Form.Label>
                <Form.Control type="text" placeholder="Paste name (optional)" name="title"
                              value={inputs.name}
                              onChange={handleInputChange}/>
            </Form.Group>
            <Form.Label htmlFor="basic-url">Paste URL</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="paste-url-prefix">zbin.tk/</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control id="paste.URL" aria-describedby="paste-url-prefix"
                              placeholder="(optional)" name="url"
                              value={inputs.url} onChange={handleInputChange}
                              disabled={inputs.expiresAfter === "-1"}
                />
                <UrlAvailabilityStatus url={inputs.url} isUrlValid={(value) => setUrlValid(value)}/>
            </InputGroup>
            <Form.Group controlId="paste.expirationTime">
                <Form.Label>Expiration Time
                    <OverlayTrigger
                        placement="top"
                        delay={{show: 250, hide: 400}}
                        overlay={renderTooltip}
                    >
                        <i className="fas fa-info-circle ml-2"/>
                    </OverlayTrigger></Form.Label>
                <Form.Control as="select" name="expiresAfter"
                              value={inputs.expiresAfter}
                              onChange={handleInputChange}>
                    <option value={10 * 60}>10 minutes</option>
                    <option value={60 * 60}>1 hour</option>
                    <option value={24 * 60 * 60}>1 day</option>
                    <option value={7 * 24 * 60 * 60}>1 week</option>
                    <option value={-1}>Max</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="paste.language">
                <Form.Label>Syntax highlighting</Form.Label>
                <Form.Control as="select" name="language" value={inputs.language}
                              onChange={handleInputChange}>
                    <option value="">Off</option>
                    {languages.map((language) => {
                        return <option key={language.toString()}>{language}</option>;
                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Switch label="Public paste" id="paste.isPublic" name="isPublic"
                             value={inputs.isPublic}
                             defaultChecked={inputs.isPublic}
                             onChange={handleInputChange}/>
                <Form.Text className="text-muted">
                    Public pastes sometimes show up on the front page. Private ones are only
                    accessible via link.
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!inputs.text || !isUrlValid}>
                Create
            </Button>
            <CreatePasteStatus data={data} loading={loading} error={error}/>
        </Form>
    );
}

export {NewPasteForm};