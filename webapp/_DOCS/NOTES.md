# Notes

### CSS React && Router Transitions
What I ...

Here's how the workaround works...
* The `.js` Component...

```javascript
this.state = {
  opacity: 0
}
...
componentDidMount(){
  window.requestAnimationFrame(()=>{ this.setState({opacity: 1}) })
}
...
// 👇 Option for Close Fade
exit = ()=>{
  this.setState({opacity: 0})
  setTimeout(()=>{this.props.history.push(back)},500)  // 🚨 Check delay on .signup-login CLASS in css
}
// ☝️
...
<div className="<component_Name>" style={{ opacity: `${this.state.opacity}`}}>
```

* The Component's `.sass`

```sass
transition: opacity .3s
// 👆🚨 must match exit = () =>{...}
```

Notable drawbacks/issues.
* Error: `Unchecked runtime.lastError: The message port closed before a response was received.`
  * This seems infrequent, and doesn't change any flow or effect of the UI. Mainly due to the delay function losing sync with react.
