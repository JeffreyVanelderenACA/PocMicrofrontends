import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import WebView from 'react-native-webview';

const getInjectableJavaScript = () => `
  class PersonComponent extends HTMLElement {
    static get observedAttributes() {
        return ['firstname'];
    }

    constructor() {
        super();
        Object.defineProperty(this, 'firstname', {
            get: function () {
                return this.getAttribute('firstname');
            },
            set: function (val) {
                this.setAttribute('firstname', val);
            },
        });

        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        const title = document.createElement('h3');
        title.id = 'title';
        title.textContent = 'Dit is een custom Web Component';

        const paragraph = document.createElement('p');
        paragraph.id = 'firstnameParagraph';
        paragraph.textContent = 'Er werd geen naam gegeven';

        const textInput = document.createElement('input');
        textInput.id = 'textInput';
        textInput.setAttribute('type', 'text');

        paragraph.addEventListener('mouseenter', () => {
            paragraph.style.borderLeft = '2px solid red';
            paragraph.style.paddingLeft = '4px';
        });
        paragraph.addEventListener('mouseleave', () => {
            paragraph.style.border = 'Opx';
            paragraph.style.paddingLeft = 'Opx';
        });
        shadow.appendChild(title);
        shadow.append(paragraph);
        shadow.appendChild(textInput);
    }

    createdCallback() {
        updateView(this);
    }

    connectedCallback() {
        updateView(this);
    }

    disconnectedCallback() {}

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'firstname':
                console.log("AttributeChangedCallback()");
                break;
            default:
                break;
        }
        updateView(this);
    }
}

function updateView(element) {
    element.shadowRoot.querySelector('#firstnameParagraph').textContent = element.getAttribute('firstname');
    element.shadowRoot.querySelector('#title').addEventListener('click', () => {
        // eslint-disable-next-line no-undef
        const event = new CustomEvent('myEvent', {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: undefined,
        });
        element.dispatchEvent(event);
    });
}

const componentName = 'some-person-component';

// eslint-disable-next-line no-undef
customElements.get(componentName) || customElements.define(componentName, PersonComponent);

window.alert("web component ->" + !!customElements.get(componentName));
`;

const App = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 50, backgroundColor: 'white' }}>
                <StatusBar barStyle={'light-content'} />
                <Text style={{ color: 'black' }}>POC microfrontends</Text>
            </View>
            <WebView
                style={{ flex: 1, borderWidth: 2, borderColor: 'red', backgroundColor: 'red' }}
                sharedCookiesEnabled
                thirdPartyCookiesEnabled
                javaScriptEnabled
                javaScriptCanOpenWindowsAutomatically
                injectedJavaScript={getInjectableJavaScript()}
            />
        </SafeAreaView>
    );
};

export default App;
