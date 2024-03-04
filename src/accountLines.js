class RPNEvaluator {
    /* Reverse Polish Notation Evaluator with some extra functions :
        sum : sum all the values in the stack
        avg : average all the values in the stack
        min : get the minimum value in the stack
        max : get the maximum value in the stack
        count : count the number of values in the stack
        root : get the root of the first value in the stack
        swap : swap the two first values in the stack
        pop : remove the first value in the stack
        sin : get the sine of the first value in the stack
        cos : get the cosine of the first value in the stack
        tan : get the tangent of the first value in the stack
        asin : get the arcsine of the first value in the stack
        acos : get the arccosine of the first value in the stack
        atan : get the arctangent of the first value in the stack
        log : get the logarithm of the first value in the stack
        ln : get the natural logarithm of the first value in the stack
        exp : get the exponent of the first value in the stack
        abs : get the absolute value of the first value in the stack
        floor : get the floor value of the first value in the stack
        ceil : get the ceil value of the first value in the stack
        round : get the round value of the first value in the stack
        sign : get the sign of the first value in the stack
        pi : get the value of pi
        e : get the value of e

      And support for variables, $name transform into .querySelectorAll(`[name="${name}"]`)
      and $parent.child transform into .querySelectorAll(`[name="${parent}"] [name="${child}"]`).
      querySelectorAll apply, by default, to the document object, but you can
      pass a different object as second parameter of RPNEvaluator.setVariable.

     */
    static evaluate (expression) {
        // reverse polish notation
        const stack = []
        const tokens = expression.split(/\s+/)
        tokens.forEach(token => {
            if (token === '') { return }
            if (token === '+') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(a + b)
            } else if (token === '-') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b - a)
            } else if (token === '*') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(a * b)
            } else if (token === '/') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b / a)
            } else if (token === '^') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(Math.pow(b, a))
            } else if (token === 'mod') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b % a)
            } else if (token === 'swap') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(a)
                stack.push(b)
            } else if (token === '%') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b / 100 * a)
            } else if (token === '%-') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b - b / 100 * a)
            } else if (token === '%+') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(b + b / 100 * a)
            } else if (token === 'cpy') {
                const a = stack.pop()
                stack.push(a)
                stack.push(a)
            } else if (token === 'pop') {
                stack.pop()
            } else if (token === 'sin') {
                stack.push(Math.sin(stack.pop()))
            } else if (token === 'cos') {
                stack.push(Math.cos(stack.pop()))
            } else if (token === 'tan') {
                stack.push(Math.tan(stack.pop()))
            } else if (token === 'asin') {
                stack.push(Math.asin(stack.pop()))
            } else if (token === 'acos') {
                stack.push(Math.acos(stack.pop()))
            } else if (token === 'atan') {
                stack.push(Math.atan(stack.pop()))
            } else if (token === 'log') {
                stack.push(Math.log(stack.pop()))
            } else if (token === 'ln') {
                stack.push(Math.log(stack.pop()) / Math.log(10))
            } else if (token === 'exp') {
                stack.push(Math.exp(stack.pop()))
            } else if (token === 'abs') {
                stack.push(Math.abs(stack.pop()))
            } else if (token === 'floor') {
                stack.push(Math.floor(stack.pop()))
            } else if (token === 'ceil') {
                stack.push(Math.ceil(stack.pop()))
            } else if (token === 'round') {
                stack.push(Math.round(stack.pop()))
            } else if (token === 'sign') {
                stack.push(Math.sign(stack.pop()))
            } else if (token === 'negate') {
                stack.push(-stack.pop())
            } else if (token === 'pi') {
                stack.push(Math.PI)
            } else if (token === 'e') {
                stack.push(Math.E)
            } else if (token === 'mround') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(Math.round(b / a) * a)
            } else if (token === 'fix') {
                const pow = Math.pow(10, stack.pop())
                const a = stack.pop()
                stack.push(Math.round(a * pow) / pow)
            } else if (token === 'sum') {
                let value = 0
                while (stack.length > 0) {
                    value += stack.pop()
                }
                stack.push(value)
            } else if (token === 'avg') {
                let value = 0
                let count = 0
                while (stack.length > 0) {
                    value += stack.pop()
                    count += 1
                }
                stack.push(value / count)
            } else if (token === 'min') {
                let value = stack.pop()
                while (stack.length > 0) {
                    value = Math.min(value, stack.pop())
                }
                stack.push(value)
            } else if (token === 'max') {
                let value = stack.pop()
                while (stack.length > 0) {
                    value = Math.max(value, stack.pop())
                }
                stack.push(value)
            } else if (token === 'count') {
                let value = 0
                while (stack.length > 0) {
                    value += 1
                    stack.pop()
                }
                stack.push(value)
            } else if (token === 'root') {
                const a = stack.pop()
                const b = stack.pop()
                stack.push(Math.pow(b, 1 / a))
            } else {
                const value = parseFloat(token)
                if (isNaN(value)) {
                    stack.push(0)
                } else {
                    stack.push(value)
                }
            }
        })
        const value = parseFloat(stack.pop())
        if (isNaN(value)) {
            return 0
        }
        return value
    }

    static getVariables (expression) {
        return expression.match(/(\$[a-zA-Z0-9_\-\.\*]+)/g) || []
    }

    static setVariables (expression, doc = document) {
        RPNEvaluator.getVariables(expression)
        .forEach(match => {
            const name = match.substring(1)
            const parts = name.split('.', 2)
            let nodes
            if (parts.length === 1) {
                nodes = doc.querySelectorAll(`[name="${parts[0]}"]`)
            } else {
                if (parts[0] === '*') {
                    nodes = document.querySelectorAll(`[name="${parts[1]}"]`)
                } else {
                    nodes = doc.querySelectorAll(`[name="${parts[0]}"] [name="${parts[1]}"]`)
                }
            }
            if (!nodes || nodes.length === 0) {
                return 
            }
            const values = []
            nodes.forEach(node => {
                const value = (node.value !== undefined && node.value !== null && node.value !== '') ? parseFloat(node.value) : parseFloat(node.dataset.value)
                if (isNaN(value)) {
                    values.push(0)
                    return
                }
                values.push(value)
            })
    
            expression = expression.replace(match, values.join(' '))
        })
        return expression
    }
}

export class AccountLines extends HTMLElement {
    constructor() {
        self = super()
        this.state = 'open'
        this.indexes = [
            0, // normal
            0, // addition
            0  // suppression
        ]
        this.toDelete = {
            name: '',
            value: 0,
            type: 'number'
        }
        this.posNode = null
        this.offset = 0
        this.values = {}
        this.nodes = []
        this.heads = []
        this.tabIndexCount = 0
    }

    setValue (name, value) {
        this.values[name] = value
    }

    getValue (name) {
        return this.values[name]
    }

    toJSON () {
        return this.getValues()
    }

    getLineValue (line) {
        const lineValue = { position: line.dataset.position }
        for(const input of line.querySelectorAll('input, textarea, select'))
        {
            input.setCustomValidity('')
            if (input.name) {
                const type = input.getAttribute('type')
                const mandatory = input.getAttribute('mandatory') !== null
                switch (type) {
                    default:
                    case 'text':
                        if (mandatory && input.value === '') {
                            return
                        }    
                        lineValue[input.name] = input.value
                        break
                    case 'number':
                        if (mandatory && (input.value === '' || isNaN(parseFloat(input.value)))) {
                            return
                        }
                        lineValue[input.name] = parseFloat(input.value)
                        break
                    case 'checkbox':
                        lineValue[input.name] = input.checked
                        break
                    case 'radio':
                        if (input.checked) {
                            lineValue[input.name] = input.value
                        }
                        break
                }
            }
        }
        if (line.dataset.id) { lineValue.id = line.dataset.id }
        if (line.dataset.relid) { lineValue.relid = line.dataset.relid }

        return lineValue
    }

    getValues () {
        const values = []
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) { continue }
            const lineValue = this.getLineValue(line)
            if (lineValue === undefined) {
                continue
            }
            values.push(lineValue)
        }
        return values.sort((a, b) => a.position - b.position)
    }

    addLine (line) {
        return this._addLine(line, true)
    }

    _addLine (line, followState = false) {
        let notEmpty = true
        if (!line.type) { line.type = 'item' }
        const domNode = document.createElement('div')
        domNode.dataset.type = line.type
        if (Object.keys(line).length <= 1) {
            domNode.dataset.used = false
            notEmpty = false
        } else {
            domNode.dataset.used = true
        }
        if (line._relPosition) {
            domNode.dataset.relatedPosition = line._relPosition
            delete line._relPosition
        }
        let position = 0
        let prePos = '1.'

        switch(line.type) {
            case 'item':
                prePos = '1.'
                position = ++this.indexes[0];
                break;
            case 'addition':
                prePos = '2.'
                position = ++this.indexes[1];
                break;
            case 'suppression':
                prePos = '3.'
                position = ++this.indexes[2];
                break;
        }
        let posNode
        if (this.posNode) {
            posNode = this.posNode.cloneNode(true)
        } else {
            posNode = document.createElement('span')
        }
        domNode.dataset.position = prePos + String(position).padStart(4, '0')
        domNode.dataset.index = position
        posNode.innerHTML = domNode.dataset.position
        if (domNode.dataset.relatedPosition) {
            posNode.innerHTML += `<br><span class="relation">${domNode.dataset.relatedPosition}</span>`
        }

        posNode.setAttribute('tabindex', -1)
        posNode.setAttribute('readonly', true)
        posNode.classList.add('account-line__position')

        domNode.appendChild(posNode)
        if (followState && (this.state === 'closed' || this.state === 'frozen') && line.type !== 'addition') {
            domNode.setAttribute('readonly', true)
        }

        this.nodes.forEach(node => {
            const newNode = node.cloneNode(true)
            if (newNode.name && line[newNode.name]) {
                newNode.value = line[newNode.name]
            }
            if (followState && (this.state === 'closed' || this.state === 'frozen') && line.type !== 'addition') {
                switch(newNode.tagName) {
                    default: 
                    case 'INPUT':
                        newNode.setAttribute('readonly', true)
                        break
                    case 'SELECT':
                        newNode.querySelectorAll('option').forEach(option => {
                            if (option.value === newNode.value) {
                                option.setAttribute('selected', true)
                            } else {
                                option.setAttribute('disabled', true)
                            }
                        })
                        break
                }
            }
            if (newNode.name === this.toDelete.name && line.type === 'suppression') {
                newNode.dataset.expression = `${newNode.dataset.expression} negate`
            }
            if (!newNode.dataset.expression) {
                newNode.setAttribute('tabindex', ++this.tabIndexCount)
            } else {
                newNode.setAttribute('tabindex', -1)
                newNode.setAttribute('readonly', true)
            }
            domNode.appendChild(newNode)
        })

        const actionDiv = document.createElement('div')
        const button = document.createElement('button')
        button.type = 'button'
        button.classList.add('account-line__remove')
        button.innerText = '-'
        button.addEventListener('click', e => {
            this.removeLine(domNode)
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
        })
        actionDiv.appendChild(button)
        domNode.appendChild(actionDiv)

        this.insertLine(domNode)
        if (notEmpty) {
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
        }
    }

    insertLine (line) {
        if (this.state !== 'open' && line.dataset.type === 'item') {
            for (let node = this.firstElementChild; node; node = node.nextElementSibling) {
                if (node.dataset.position > line.dataset.position || node.classList.contains('head-addition') || node.classList.contains('head-suppression')) {
                    this.insertBefore(line, node)
                    return
                }
            }    
        }
        for (let node = this.firstElementChild; node; node = node.nextElementSibling) {
            if (node.dataset.position > line.dataset.position) {
                this.insertBefore(line, node)
                return
            }
        }
        this.appendChild(line)
    }

    addEmptyLine () {
        return this._addLine({})
    }

    update () {
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            const inputs = line.querySelectorAll('[data-expression]')
            inputs.forEach(input => {
                if (input.dataset.deleted === 'true') { input.value = 0;  return }
                input.value = RPNEvaluator.evaluate(
                    RPNEvaluator.setVariables(input.dataset.expression, line)
                )
            })
        }
    }

    removeLine (node, force = false) {
        if (!node) { return }

        if (node.getAttribute('readonly') === 'true') {
            if (this.querySelector(`div[data-related-position="${node.dataset.position}"]`)) {
                return
            }

            const lineValue = this.getLineValue(node)
            lineValue._relPosition = node.dataset.position
            lineValue.type = 'suppression'
            lineValue.name = lineValue.name
            if (lineValue[this.toDelete.name]) {
                switch (this.toDelete.value) {
                    case 'set-zero': lineValue[this.toDelete.name] = 0; break
                    case 'set-empty': lineValue[this.toDelete.name] = ''; break
                    case 'set-false': lineValue[this.toDelete.name] = false; break
                    case 'set-null': lineValue[this.toDelete.name] = null; break
                    case 'set-undefined': lineValue[this.toDelete.name] = undefined; break
                    case 'negate': break
                }
            }
            
            if (lineValue.id) {
                lineValue.relid = lineValue.id
                delete lineValue.id
            }
            this._addLine(lineValue)
            return 
        }

        node.remove()
        this.indexes[0] = 0
        this.indexes[1] = 0
        this.indexes[2] = 0
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) { continue }
            let position = 0
            let prePos = '1.'
            switch(line.dataset.type) {
                case 'item': position = ++this.indexes[0]; break
                case 'addition': prePos = '2.'; position = ++this.indexes[1]; break
                case 'suppression': prePos = '3.'; position = ++this.indexes[2]; break
            }
            line.dataset.position = `${prePos}${String(position).padStart(4, '0')}`
            line.querySelector('.account-line__position').innerText = line.dataset.position
        }
    }

    handleNewLineEvents (event) {
        const target = event.target
        
        let parent = target
        while (parent && !parent.dataset?.index) { parent = parent.parentNode }
        if (!parent) { return }
        if (parent.dataset.type === 'suppression') { 
            const input = this.querySelector(`div[data-position="${parent.dataset.relatedPosition}"] [name="${target.name}"]`)
            switch (target.type) {
                default:
                case 'text':
                    if (target.value !== input.value) {
                        target.value = input.value
                    }
                    break
                case 'number':
                    const value = parseFloat(target.value)
                    if (value > parseFloat(input.value) || isNaN(value)) {
                        target.value = input.value
                    }
                    break
                case 'checkbox':
                    if (target.checked !== input.checked) {
                        target.checked = input.checked
                    }
                    break
                case 'radio':
                    if (target.value !== input.value) {
                        target.checked = input.checked
                    }
                    break
            }
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
            return
        }
        parent.dataset.used = true
        let newLine = true
        this.querySelectorAll(`[data-type="${parent.dataset.type}"]`).forEach(node => {
            if (node.dataset.used === 'false') {
                newLine = false
            }
        })
        if (newLine) { this.addLine({type: parent.dataset.type}) }
    
        this.update()
        this.dispatchEvent(new CustomEvent('update'))
    }

    loadLines (lines) {
        lines.forEach(line => {
            this.addLine(line)
        })
    }

    connectedCallback() {
        const headNode = document.createElement('div')
        const state = this.getAttribute('state')
        if (state) {
            this.state = state
        }

        this.addEventListener('keyup', e => this.handleNewLineEvents(e))
        this.addEventListener('change', e => this.handleNewLineEvents(e))
        this.addEventListener('focus', e => {
            switch(e.target.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                    this.handleNewLineEvents(e)
            }
        })

        const headDefinition = this.querySelector('account-head-definition')
        headNode.classList.add('account-line__head')
        Array.from(headDefinition.children).forEach(node => {
            node.remove()
            this.heads.push(node)
            headNode.appendChild(node)
        })
        
        if (this.state === 'open') {
            const spanButton = document.createElement('span')
            const addButton = document.createElement('button')
            addButton.type = 'button'
            addButton.classList.add('account-line__add')
            addButton.innerText = '+'
            addButton.addEventListener('click', e => {
                this.addLine({type: 'item'})
            })
            spanButton.appendChild(addButton)
            headNode.appendChild(spanButton)
        } else {
            headNode.appendChild(document.createElement('legend'))
        }
        headDefinition.remove()

        const lineDefinition = this.querySelector('account-line-definition')
        Array.from(lineDefinition.children).forEach(node => {
            if (node.getAttribute('to-delete')) {
                this.toDelete.name = node.getAttribute('name')
                this.toDelete.value = node.getAttribute('to-delete')
                this.toDelete.type = node.getAttribute('type')
            }
            node.remove()
            if (node.getAttribute('type') === 'position') {
                this.posNode = node
                return
            }
            this.nodes.push(node)
        })
        lineDefinition.remove()

        this.appendChild(headNode)

        const myName = this.getAttribute('name')
        if (myName) {
            const node = document.querySelector(`[for="${myName}"]`)
            if (node) {
                node.addEventListener('update', e => {
                    this.update()
                })
            }
        }

        if (this.state !== 'open') {
            const headAddition = document.createElement('div')
            headAddition.dataset.position = '2.0000'
            headAddition.classList.add('account-line__head', 'head-addition', 'head-intermediate')
            headAddition.innerHTML = `<span></span><span style="grid-column: 2 / span ${this.heads.length - 1}">Addition</span><span><button type="button" class="account-line__add">+</button></span>`
            this.appendChild(headAddition)
            headAddition.querySelector('button').addEventListener('click', e => {
                this.addLine({type: 'addition'})
            })
            const headSuppression = document.createElement('div')
            headSuppression.dataset.position = '3.0000'
            headSuppression.classList.add('account-line__head', 'head-suppression', 'head-intermediate')
            headSuppression.innerHTML = `<span></span><span style="grid-column: 2 / span ${this.heads.length - 1}">Suppression</span><span></span>`
            this.appendChild(headSuppression)
        }
    }
}

class AccountSummary extends HTMLElement {
    constructor () {
        super()
        this.for = null
    }

    update () {
        const nodes = []
        Array.from(this.querySelectorAll('[data-expression]'))
        .forEach(node => {
            nodes.push({
                value: 0,
                dom: node,
                name: node.getAttribute('name'),
                require: RPNEvaluator.getVariables(node.dataset.expression)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map(value => value.substring(1)),
                next: []
            })
        })

        nodes.forEach(node => {
            node.require.forEach(require => {
                nodes.forEach(other => {
                    if (other.name === require) {
                        node.next.push(other)
                    }
                })
            })
        })

        const traverseGraph = (node, visited = new Set(), recursionStack = new Set()) => {
            if (recursionStack.has(node)) { throw new Error('Cyclic dependency') }
            if (visited.has(node)) { return }
            recursionStack.add(node)
            visited.add(node)
            node.next.forEach(next => {
                traverseGraph(next, visited, recursionStack)
            })
            let expression = RPNEvaluator.setVariables(node.dom.dataset.expression, this)
            if (this.for) { expression = RPNEvaluator.setVariables(expression, this.for) }
            node.value = RPNEvaluator.evaluate(
                expression
            )
            node.dom.dataset.value = node.value
        }
        nodes.forEach(node => traverseGraph(node))
        nodes.forEach(node => node.dom.querySelector('span').innerHTML = node.value)
    }

    connectedCallback () {
        const forNode = this.getAttribute('for')
        if (forNode) {
            const node = document.querySelector(`[name="${forNode}"]`)
            if (node) {
                this.for = node
                node.addEventListener('update', e => {
                    this.update()
                })
            }
        }
        this.querySelectorAll('[name]').forEach(node => {
            node.addEventListener('change', e => { 
                this.update() 
                this.dispatchEvent(new CustomEvent('update'))
            })
        })
    }
}

customElements.define('account-lines', AccountLines)
customElements.define('account-summary', AccountSummary)