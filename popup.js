document.getElementById('fetch-colors').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractColors
        },
        (results) => {
          const colors = results[0].result;
          displayColors(colors);
        }
      );
    });
  });
  
  function extractColors() {
    const colors = {};
    const elements = document.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color) {
        colors[color] = colors[color] || { type: 'text', count: 0 };
        colors[color].count++;
      }
  
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        colors[backgroundColor] = colors[backgroundColor] || { type: 'background', count: 0 };
        colors[backgroundColor].count++;
      }
    });
    
    return colors;
  }
  
  function displayColors(colors) {
    const colorList = document.getElementById('color-list');
    colorList.innerHTML = '';
    
    for (const color in colors) {
      const li = document.createElement('li');
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = color;
      
      const colorInfo = document.createElement('div');
      colorInfo.className = 'color-info';
      colorInfo.textContent = `Used ${colors[color].count} times`;
  
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        copyButton.textContent = 'Copied!';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
      });
      
      li.appendChild(colorBox);
      li.appendChild(colorInfo);
      li.appendChild(copyButton);
      
      colorList.appendChild(li);
    }
  }
  