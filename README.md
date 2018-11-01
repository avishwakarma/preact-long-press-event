# preact-long-press-event: `onLongPress` for __[Preact]__


`onLongPress` is a CustomEvent generated using native Event.


Inspired by [long-press]
---

## Usage

`npm i -S preact-long-press-event`


```js
// in your index.js

import injectLongPressEvent from 'preact-long-press-event';

injectLongPressEvent();

// in your component

class MyComponent extends Component {
  
  longPress(event) {
    // longPress event handller
  }

	render() {
		return (
			<div class="app">
				<button onLongPress={this.longPress}>Long Press Me!</button>
			</div>
		);
	}
}
```
---


[Preact]: https://github.com/developit/preact
[long-press]: https://github.com/john-doherty/long-press/