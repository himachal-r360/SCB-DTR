import { Injectable } from '@angular/core';

/**
 * Class for managing stylesheets. Stylesheets are loaded into named slots so that they can be
 * removed or changed later.
 */
@Injectable()
export class StyleManagerService {

  /**
   * Set the stylesheet with the specified key.
   */
  setStyle(key: string, href: string) {
    getLinkElementForKey(key).setAttribute('href', href);
  }

  /**
   * Remove the stylesheet with the specified key.
   */
  removeStyle(key: any) {
    const existingLinkElement = getExistingLinkElementByKey(key);
    
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }
  
  
    /**
   * Set the script with the specified key.
   */
  setScript(key: string, src: string) {
    getScriptElementForKey(key).setAttribute('src', src);
  }

  /**
   * Remove the script with the specified key.
   */
  removeScript(key: any) {
     const existingLinkElement = getExistingScriptElementByKey(key);
    if (existingLinkElement) {
      document.body.removeChild(existingLinkElement);
    }
  }


}

function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}


function getScriptElementForKey(key: string) {
  return getExistingScriptElementByKey(key) || createScriptElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(`link[rel="stylesheet"].${getClassNameForKey(key)}`);
}

function getExistingScriptElementByKey(key: string) {
  return document.body.querySelector(`script.${getScriptClassNameForKey(key)}`);
}


function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  //document.head.insertBefore(linkEl, document.head.firstChild);
  return linkEl;
}

function createScriptElementWithKey(key: string) {
  const linkEl = document.createElement('script');
  linkEl.setAttribute('defer', 'defer');
   linkEl.setAttribute('id', getScriptClassNameForKey(key));
  linkEl.classList.add(getScriptClassNameForKey(key));
  document.body.appendChild(linkEl);
  return linkEl;
}


function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}

function getScriptClassNameForKey(key: string) {
  return `script-manager-${key}`;
}
