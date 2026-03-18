// This is a simple example Widget to get you started with Übersicht.
export const command = "whoami";
export const refreshFrequency = 1000000;
export const className =`
  top: 10%;
  right: 0;
  left: 0;
  width: 340px;
  box-sizing: border-box;
  margin: auto;
  padding: 120px 20px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(20px);
  color: #141f33;
  font-family: Helvetica Neue;
  font-weight: 300;
  border: 2px solid #fff;
  border-radius: 1px;
  text-align: justify;
  line-height: 1.5;
  h1 { font-size: 20px; margin: 16px 0 8px; }
  em { font-weight: 400; font-style: normal; }
`
export const render = ({output}) => (
  <div>
    <h1>Hi, {output}</h1>
    <p>Thanks for trying out Übersicht! This is an example widget.</p>
    <p>To view this example widget, choose <em>'Open Widgets Folder'</em> from the status bar menu.</p>
  </div>
);
