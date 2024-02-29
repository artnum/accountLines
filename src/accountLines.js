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

/* TODO : group lines
 */
export class AccountLines extends HTMLElement {
    constructor() {
        self = super()
        this.posNode = null
        this.offset = 0
        this.values = {}
        this.lines = []
        this.linesInGroup = []
        this.nodes = []
        this.heads = []
        this.group = []
        this.inGroup = 0
        this.groupLineCount = 0
        this.groupIndexCount = 0
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

    getValues () {
        const values = []
        let index = 0
        this.lines.forEach(line => {
            const lineValue = {}
            for( const input of [ ...line.querySelectorAll('input'),
                ...line.querySelectorAll('textarea'),
                ...line.querySelectorAll('select')])
            {
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
            lineValue.position = ++index
            values.push(lineValue)
        })
        return values.sort((a, b) => a.position - b.position)
    }

    addGroupTail () {
        const groupTail = document.createElement('div')
        groupTail.dataset.groupId = this.inGroup
        groupTail.classList.add(`account-line__group-tail`)

        const span = document.createElement('span')
        span.innerHTML = '&nbsp;'
        groupTail.appendChild(span)
        this.group.forEach(_ => {
            const span = document.createElement('span')
            span.innerHTML = '&nbsp;'
            groupTail.appendChild(span)
        })
        const actionDiv = document.createElement('span')
        actionDiv.innerHTML = '<button type="button" class="account-line__remove">fin</button>'
        actionDiv.querySelector('button').addEventListener('click', e => {
            this.inGroup = 0
            this.addEmptyLine()
            
        })
        groupTail.appendChild(actionDiv)
        this.appendChild(groupTail)
    }

    addNewGroup () {
        this.groupIndexCount++
        this.inGroup = this.groupIndexCount

        const group = document.createElement('div')
        group.dataset.used = false
        group.dataset.groupId = this.inGroup
        group.classList.add('account-line__group')
        group.innerHTML = `
            <span class="account-line__position">${String(this.offset + this.lines.length + 1).padStart(4, '0')}</span>`
        this.group.forEach(node => {
            const newNode = node.cloneNode(true)
            if (newNode.dataset.expression) {
                newNode.dataset.expression = newNode.dataset.expression.replace(/\%/g, this.inGroup)
            }
            if (!newNode.dataset.expression) {
                newNode.setAttribute('tabindex', ++this.tabIndexCount)
            } else {
                newNode.setAttribute('tabindex', -1)
                newNode.setAttribute('readonly', true)
            }
            group.appendChild(newNode)
        })
        this.lines.push(group)
        group.dataset.index = this.lines.length

        group.appendChild(document.createElement('span'))
        this.appendChild(group)
        for (let child = group.firstElementChild; child; child = child.nextElementSibling) {
            let found = false
            switch(child.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                    found = true
                    child.focus()
                    break
            }
            if (found) { break }
        }
        this.addGroupTail()
        this.addEmptyLine()    
    }

    addLine (line) {
        let notEmpty = true
        const domNode = document.createElement('div')
        if (Object.keys(line).length <= 0) {
            domNode.dataset.used = false
            notEmpty = false
        }
        let position = this.offset + this.lines.length + 1
        if (this.inGroup !== 0) {
            domNode.classList.add('account-line__grouped')
            domNode.dataset.groupId = this.inGroup
            if (this.linesInGroup[this.inGroup - 1] === undefined) { this.linesInGroup[this.inGroup - 1] = [] }
            position = this.linesInGroup[this.inGroup - 1].length + 1
        }

        let posNode
        if (this.posNode) {
            posNode = this.posNode.cloneNode(true)
            posNode.innerHTML = String(position).padStart(4, '0')
        } else {
            posNode = document.createElement('span')
            posNode.innerHTML = String(position).padStart(4, '0')
        }
        posNode.setAttribute('tabindex', -1)
        posNode.setAttribute('readonly', true)
        posNode.classList.add('account-line__position')

        domNode.appendChild(posNode)
        if (line._readonly) {
            domNode.setAttribute('readonly', true)
        }

        this.nodes.forEach(node => {
            const newNode = node.cloneNode(true)
            if (this.inGroup !== 0 && newNode.dataset.nameInGroup) {
                newNode.name = newNode.dataset.nameInGroup.replace(/\%/g, this.inGroup)
            }
            if (newNode.name && line[newNode.name]) {
                newNode.value = line[newNode.name]
            }
            if (line._readonly) {
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
                const index = domNode.dataset.index
                this.removeLine(index)
                this.update()
                this.dispatchEvent(new CustomEvent('update'))
            })
            actionDiv.appendChild(button)
        if (this.groupEnabled) {
            if (this.group.length > 0 && this.inGroup === 0) {
                const groupButton = document.createElement('button')
                groupButton.type = 'button'
                groupButton.classList.add('account-line__group')
                groupButton.innerText = 'group'
                groupButton.addEventListener('click', e => {
                    this.addNewGroup()
                })
                groupButton.addEventListener('focus', e => {
                    document.activeElement.blur()
                })
                actionDiv.appendChild(groupButton)
            }
        }
        domNode.appendChild(actionDiv)
        domNode.dataset.index = this.lines.length

        if (this.inGroup === 0) {
            this.appendChild(domNode)
            this.lines.push(domNode)
        } else {
            if (this.linesInGroup[this.inGroup - 1] === undefined) { this.linesInGroup[this.inGroup - 1] = [] }
            this.linesInGroup[this.inGroup - 1].push(domNode)
            const groupTail = this.querySelector(`.account-line__group-tail[data-group-id="${this.inGroup}"]`)
            groupTail.parentNode.insertBefore(domNode, groupTail)
        }

        if (notEmpty) {
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
        }
    }

    addEmptyLine () {
        return this.addLine({})
    }

    update () {
        const cont = this.getAttribute('continue')
        if (cont) {
            this.offset = document.querySelector(`[name="${cont}"]`).lines.length
            this.lines.forEach((line, index) => {
                line.querySelector('.account-line__position').innerText = String(this.offset + index + 1).padStart(4, '0')
                line.dataset.index = index
            })

        }
        this.linesInGroup.forEach((group, index) => {
            group.forEach((line, index) => {
                const inputs = line.querySelectorAll('[data-expression]')
                inputs.forEach(input => {
                    if (input.dataset.deleted === 'true') { input.value = 0;  return }
                    input.value = RPNEvaluator.evaluate(
                        RPNEvaluator.setVariables(input.dataset.expression, line)
                    )
                })
            })
        })
        this.lines.forEach(line => {
            const inputs = line.querySelectorAll('[data-expression]')
            inputs.forEach(input => {
                if (input.dataset.deleted === 'true') { input.value = 0;  return }
                input.value = RPNEvaluator.evaluate(
                    RPNEvaluator.setVariables(input.dataset.expression, line)
                )
            })
        })        
    }

    removeLine (index, force = false) {
        index = parseInt(index)
        if (isNaN(index)) { return }
        
        const node = this.lines[index]
        if (node.getAttribute('readonly') === 'true') {
            let deleted = true
            if (node.dataset.deleted === 'true') { deleted = false }
            node.dataset.deleted = deleted
            node.classList.toggle('account-line__deleted')
            node.querySelectorAll('input, textarea, select').forEach(input => {
                input.dataset.deleted = deleted
            })
            return 
        }

        if (this.lines.length <= 1 && !force) { return }

        this.lines.splice(index, 1)
        node.remove()
        if (node.dataset.groupId) {
            this.linesInGroup[node.dataset.groupId - 1].forEach((line, index) => {
                line.remove()
            })
            this.linesInGroup[node.dataset.groupId - 1] = []
        }
        this.lines.forEach((line, index) => {
            line.querySelector('.account-line__position').innerText = String(this.offset + index + 1).padStart(4, '0')
            line.dataset.index = index
        })
        if (this.lines.length === 0) {
            return
        }
        if (this.lines.length <= index) {
            this.lines[this.lines.length  - 1].querySelector('input').focus()
            delete this.lines[this.lines.length  - 1].dataset.used
            return
        }
        this.lines[index].querySelector('input').focus()    
    }

    handleNewLineEvents (event) {
        const target = event.target
        
        let parent = target
        while (parent && !parent.dataset?.index) { parent = parent.parentNode }
        if (!parent) { return }
        parent.dataset.used = true
        let newLine = false
        if (parent.dataset.groupId) {
            this.inGroup = parseInt(parent.dataset.groupId)
            if (this.linesInGroup[this.inGroup - 1] === undefined || this.linesInGroup[this.inGroup - 1][this.linesInGroup[this.inGroup - 1].length - 1].dataset.used === 'true') {
                newLine = true
            }
        } else {
            this.inGroup = 0
            if (this.lines[this.lines.length - 1].dataset.used === 'true') {
                newLine = true
            }
        }
        if (newLine) { this.addEmptyLine() }
    
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
        headNode.appendChild(document.createElement('legend'))
        headDefinition.remove()

        const lineDefinition = this.querySelector('account-line-definition')
        Array.from(lineDefinition.children).forEach(node => {
            node.remove()
            if (node.getAttribute('type') === 'position') {
                this.posNode = node
                return
            }
            this.nodes.push(node)
        })
        lineDefinition.remove()

        const groupDefinition = this.querySelector('account-group-definition')
        Array.from(groupDefinition.children).forEach((node, index) => {
            node.remove()
            node.classList.add(`account-line__group-${index + 1}`)
            this.group.push(node)
        })
        groupDefinition.remove()

        this.appendChild(headNode)
        const cont = this.getAttribute('continue')
        if (cont) {
            const node = document.querySelector(`[name="${cont}"]`)
            this.offset = node.lines.length + node.offset
            document.querySelector(`[name="${cont}"]`).addEventListener('update', e => {
                const node = document.querySelector(`[name="${cont}"]`)
                this.offset = node.lines.length + node.offset
                this.update()
            })
        }

        const myName = this.getAttribute('name')
        if (myName) {
            const node = document.querySelector(`[for="${myName}"]`)
            if (node) {
                node.addEventListener('update', e => {
                    this.update()
                })
            }
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