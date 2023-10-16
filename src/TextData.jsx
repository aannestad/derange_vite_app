import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderLatex(latex) {
    return katex.renderToString(latex, {
        throwOnError: false
    });
}

const introText = `
Ever since I learned about <a href="https://en.wikipedia.org/wiki/Derangement" target="_blank" rel="noopener noreferrer">derangements</a> in the
UiB course <a href="https://www.uib.no/en/course/MAT221" target="_blank" rel="noopener noreferrer">MAT221</a>, I have been fascinated by the surprising
 property that the probability of a derangement (i.e. all objects are rearranged to a
new position by a random shuffle) is independent
of the number of objects and approaches

${renderLatex("\\lim_{n \\to \\infty} \\frac{!n}{n!} = \\lim_{n \\to \\infty} \\sum_{i=0}^{n} \\frac{(-1)^i}{i!} = e^{-1} \\approx 0.367879\\ldots")}

<br><br />

Therefore the probability that at least one object
remains in the original position is ${renderLatex("1-e^{-1} \\approx 63.2\\%")}.

<br><br />

I have built the following application to verify these intriguing properties:
<br><br />
`;

export function IntroTextComponent() {
    return <div dangerouslySetInnerHTML={{ __html: introText }} />;
}

const outroText = `
I created this page using <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Vite</a>. 
My code can be found <a href="https://github.com/aannestad/derange_vite_app" target="_blank" rel="noopener noreferrer">here</a>.
`;

export function OutroTextComponent() {
    return <div dangerouslySetInnerHTML={{ __html: outroText }} />;
}
