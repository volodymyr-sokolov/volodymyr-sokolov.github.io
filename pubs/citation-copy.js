document.addEventListener('DOMContentLoaded', function() {
    const citationElements = document.querySelectorAll('small.citation');
    
    citationElements.forEach(function(citation) {
        const wrapper = document.createElement('div');
        wrapper.className = 'citation-wrapper';
        
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.innerHTML = '<img src="/icons/copy.svg" alt="Copy">';
        button.setAttribute('title', 'Copy citation');
        button.onclick = function() {
            copyText(citation, button);
        };
        
        citation.parentNode.insertBefore(wrapper, citation);
        wrapper.appendChild(citation);
        wrapper.appendChild(button);
    });
});

function copyText(element, button) {
    let textToCopy = element.innerText.trim();
    
    if (textToCopy.startsWith('`') && textToCopy.endsWith('`')) {
        textToCopy = textToCopy.slice(1, -1);
    }
    
    navigator.clipboard.writeText(textToCopy).then(function() {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<img src="/icons/check.svg" alt="Copied">';
        button.classList.add('copied');
        
        setTimeout(function() {
            button.innerHTML = originalIcon;
            button.classList.remove('copied');
        }, 2000);
    }, function() {
        alert("Copy error");
    });
}