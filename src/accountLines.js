import DND from './dnd.js'
/* registers are global and can be used to store intermediate values 
 * special registers : 
 *   - INTERMEDIATE : store the intermediate value for some operation
 *   - LAST : store the last value
 */
const Registers = {
}

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
    static evaluate (expression, withStack = []) {
        // reverse polish notation
        let storedExpression = ''
        let storing = false
        const stack = withStack
        let jump = ''
        const tokens = expression.split(/\s+/)
        tokens.forEach(token => {
            if (token === '') { return }
            if (storing && token !== '|') {
                storedExpression += token + ' '
                return
            }
            if (token === '}') {
                if (jump.length === 0) { return }
                jump = ''
                return
            }
            if (jump.length > 0) { return }
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
                Registers.INTERMEDIATE = (b / 100 * a)
                stack.push(b - Registers.INTERMEDIATE)
            } else if (token === '%+') {
                const a = stack.pop()
                const b = stack.pop()
                Registers.INTERMEDIATE = (b / 100 * a)
                stack.push(b + Registers.INTERMEDIATE)
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
            } else if (token === 'ldr') { // load from register
                const a = stack.pop()
                stack.push(Registers[a]) 
            } else if (token === 'str') { // store in register
                const a = stack.pop()
                Registers[a] = stack.pop()
                stack.push(Registers[a])
            } else if (token === 'cpr') { // copy from register to register
                const a = stack.pop()
                const b = stack.pop()
                Registers[a] = Registers[b]
            } else if (token === 'mround') { // round to multiple
                const a = stack.pop()
                const b = stack.pop()
                const rounded = Math.round(b / a) * a
                Registers.INTERMEDIATE = rounded - b
                stack.push(rounded)
            } else if (token === 'fix') {
                const pow = Math.pow(10, stack.pop())
                const a = stack.pop()
                const fixed = Math.round(a * pow) / pow
                Registers.INTERMEDIATE = fixed - a
                stack.push(fixed)
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
                Registers.INTERMEDIATE = count
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
            } else if (token === 'debug') {
                console.log(stack)
                console.log(Registers)
            } else if (token === 'jmpz') {
                const label = stack.pop()
                const a = stack.pop()
                if (a === 0) {
                    jump = '{'
                } else {
                    stack.push(a)
                }            
            } else if (token === 'jmpnz') {
                const label = stack.pop()
                const a = stack.pop()
                if (a !== 0) {
                    jump = '{'
                } else {
                    stack.push(a)
                }
            } else if (token === 'eachreg') {
                const args = storedExpression.split(/\s+/).filter(arg => arg !== '')
                const regBaseName = args.shift()
                const regStart = parseInt(args.shift())
                const regEnd = parseInt(args.shift())
                const initValue = parseFloat(args.shift())
                const expression = args.join(' ')
                let value = initValue
                let prev = initValue
                for (let i = regStart; i <= regEnd; i++) {
                    value = Registers[`${regBaseName}${i}`]
                    prev = RPNEvaluator.evaluate(expression, [prev, value])
                }
                value = prev
                storedExpression = ''
                stack.push(value)
            } else if (token === 'reset') {
                for (const key in Registers) {
                    delete Registers[key]
                }
                Registers.INTERMEDIATE = 0
                Registers.LAST = 0
            } else {
                if (token.startsWith('~')) {
                    stack.push(token.substring(1))
                    return
                }
                if (token.startsWith('$')) {
                    stack.push(token.substring(1))
                    return
                }
                if (token === '{') {
                    stack.push(token)
                    return
                }

                if (token === '|') {
                    storing = !storing
                    return
                }

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
            Registers.LAST = 0
            return 0
        }
        Registers.LAST = value
        return value
    }

    static getRequiredRegisters (expression) {
        let required = []
        const tokens = expression.split(/\s+/)
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === 'ldr') {
                required.push(tokens[i - 1])
                continue
            }
            if (tokens[i] === 'cpr') {
                if (tokens[i - 2] === '~INTERMEDIATE') { continue }
                if (tokens[i - 2] === '~LAST') { continue }
                required.push(tokens[i - 2])
                continue
            }
        }
        return required
    }

    static getProvidedRegisters (expression) {
        let provided = []
        const tokens = expression.split(/\s+/)
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === 'str') {
                provided.push(tokens[i - 1])
                continue
            }
            if (tokens[i] === 'cpr') {
                if (tokens[i - 1] === '~INTERMEDIATE') { continue }
                if (tokens[i - 1] === '~LAST') { continue }
                provided.push(tokens[i - 1])
                continue
            }
        }
        return provided
    }

    static getVariables (expression) {
        return expression.match(/(\$[a-zA-Z0-9_\-\.\*]+)/g) || []
    }

    static reset () {
        for (const key in Registers) {
            delete Registers[key]
        }
        Registers.INTERMEDIATE = 0
        Registers.LAST = 0
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
        this.dnd = {
            node: null,
            currentOver: null,
            lastMousePos: null
        }
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
        this.precision = null
        this.parser = (value) => value
        this.installTextarea = null
        this.getTextareaValue = null
    }

    getEvaluator () {
        return RPNEvaluator
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

    evaluate (expression) {
        return RPNEvaluator.evaluate(expression)
    }

    getLineValue (line) {
        const lineValue = { position: line.dataset.position }
        for(const input of line.querySelectorAll('input, textarea, select, div'))
        {
            if (input.name || input.dataset.name) {
                const name = input.name ?? input.dataset.name
                const type = input?.dataset.type || input.getAttribute('type') || 'text'
                const mandatory = input.hasAttribute('mandatory')
                switch (type) {
                    case 'textarea':
                        if (this.getTextareaValue) {
                            let value = undefined

                            value = this.getTextareaValue(input)
                            if (mandatory && (value === undefined || value === null)) {
                                return
                            }
                            lineValue[name] = value
                            break
                        }
                        /* fall throug */
                    default:
                    case 'text':
                        let value = undefined
                        if (input.dataset.value) {
                            value = input.dataset.value
                        } else {
                            value = input.value
                        }
                        if (mandatory && (value === undefined)) {
                            return
                        }
                        lineValue[name] = value
                        break
                    case 'number':
                        if (mandatory && (input.value === '' || isNaN(parseFloat(input.value)))) {
                            return
                        }
                        lineValue[name] = parseFloat(input.value)
                        if (lineValue[name] === NaN) { lineValue[name] = 0 }
                        break
                    case 'checkbox':
                        lineValue[name] = input.checked
                        break
                    case 'radio':
                        if (input.checked) {
                            lineValue[name] = input.value
                        }
                        break
                }
            }
        }
        if (line.dataset.id) { lineValue.id = line.dataset.id }
        if (line.dataset.related) { lineValue.related = line.dataset.related }
        if (line.dataset.type) { lineValue.type = line.dataset.type }

        return lineValue
    }

    getValues () {
        const content = {id: this.id ?? this.dataset.id ?? 0, lines: []}       
        const values = []
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) { continue }
            const lineValue = this.getLineValue(line)
            if (lineValue === undefined) {
                continue
            }
            values.push(lineValue)
        }
        content.lines = values.sort((a, b) => a.position - b.position)
        return content
    }

    addLine (line) {
        return this._addLine(line, true)
    }

    lockLine (line) {
        line.setAttribute('readonly', true)
        for(let node = line.firstElementChild; node; node = node.nextElementSibling) {
            if (node.dataset.expression) { continue; }
            node.dataset.readonly = 'true'
            switch(node.tagName) {
                default: 
                case 'INPUT':
                    node.setAttribute('readonly', true)
                    break
                case 'SELECT':
                    node.querySelectorAll('option').forEach(option => {
                        if (option.value === node.value) {
                            option.setAttribute('selected', true)
                        } else {
                            option.setAttribute('disabled', true)
                        }
                    })
                    break
            }
        }
    }

    unlockLine (line) {
        line.removeAttribute('readonly')
        for(let node = line.firstElementChild; node; node = node.nextElementSibling) {
            if (node.dataset.expression) { continue; }
            node.dataset.readonly = 'false'
            switch(node.tagName) {
                default: 
                case 'INPUT':
                    node.removeAttribute('readonly')
                    break
                case 'SELECT':
                    node.querySelectorAll('option').forEach(option => {
                        option.removeAttribute('disabled')
                    })
                    break
            }
        }
    }

    createTextAreaNode (node, line) {
        if (line[node.name] === undefined) { line[node.name] = '' }
        const newNode = this.renderTextDiv(line[node.name])
        newNode.dataset.name = node.name
        if (node.dataset.expression) { newNode.dataset.expression = node.dataset.expression }
        newNode.setAttribute('tabindex', node.getAttribute('tabindex'))
        if (node.hasAttribute('mandatory')) { newNode.setAttribute('mandatory', true) }
        return newNode
    }

    _addLine (line) {
        let notEmpty = true
        if (!line.type) { line.type = 'item' }
        if (!line.state) { line.state = 'open' }
        const domNode = document.createElement('div')
        if (line.state === 'open') {
            new DND(domNode)
            domNode.addEventListener('dnd-start', e => {
                this.dnd.node = e.target
                this.dnd.nodeAfter = e.target.nextElementSibling
                if (this.dnd.pholder) {
                    this.dnd.pholder.remove()
                }
                this.dnd.pholder = document.createElement('div')
                this.dnd.pholder.classList.add('account-line__placeholder')
    
                this.dnd.node.parentNode.insertBefore(this.dnd.pholder, this.dnd.node)
    
                this.classList.add('dnd-in-progress')
                this.dnd.node.classList.add('account-line__dragging')
            })
            domNode.addEventListener('dnd-over', e => {
                /* mouse difference allows to know if we move up or down, negative is up */
                if (this.dnd.lastMousePos === null) {
                    this.dnd.lastMousePos = e.detail.y
                }
                const mouseDiff = e.detail.y - this.dnd.lastMousePos
                
                this.dnd.lastMousePos = e.detail.y
                if (e.currentTarget.dataset.type !== this.dnd.node.dataset.type) { return }
                if (e.currentTarget === this.dnd.node) { return }

                this.dnd.node.remove()
                /* move up we insert before, move down we insert after */
                if (mouseDiff < 0) {
                    e.currentTarget.parentNode.insertBefore(this.dnd.node, e.currentTarget)
                } else {
                    e.currentTarget.parentNode.insertBefore(this.dnd.node, e.currentTarget.nextElementSibling)
                }
                return
            })
        }

        if (line.id) {
            domNode.dataset.id = line.id
            domNode.id = line.id
        }
        if (line.related) {
            domNode.dataset.related = line.related
        }
        domNode.dataset.type = line.type
        if (Object.keys(line).length <= 2) {
            domNode.dataset.used = false
            notEmpty = false
        } else {
            domNode.dataset.used = true
        }
        if (line._relPosition) {
            domNode.dataset.relatedPosition = line._relPosition
            delete line._relPosition
        }
        domNode.dataset.rawLineData = JSON.stringify(line)
        let position = 0
        let prePos = 1
        switch(line.type) {
            case 'item':
                prePos = 1
                position = ++this.indexes[0];
                break;
            case 'addition':
                prePos = 2
                position = ++this.indexes[1];
                break;
            case 'suppression':
                prePos = 3
                position = ++this.indexes[2];
                break;
        }
        let posNode
        if (this.posNode) {
            posNode = this.posNode.cloneNode(true)
        } else {
            posNode = document.createElement('span')
        }
        domNode.dataset.position = `${prePos}.${String(position).padStart(4, '0')}`
        domNode.dataset.index = position
        posNode.innerHTML = domNode.dataset.position
        if (domNode.dataset.relatedPosition) {
            posNode.innerHTML += `<br><span class="relation">${domNode.dataset.relatedPosition}</span>`
        }

        posNode.setAttribute('tabindex', -1)
        posNode.setAttribute('readonly', true)
        posNode.classList.add('account-line__position')

        domNode.appendChild(posNode)
        this.nodes.forEach(node => {
            const newNode = (() => {
                if (node.type === 'textarea' && !this.installTextarea) {
                    return this.createTextAreaNode(node, line)
                }
                const newNode = node.cloneNode(true)
                if (newNode.name && line[newNode.name]) {
                    if (newNode.tagName === 'DIV') {
                        newNode.innerHTML = line[newNode.name]
                    } else {
                        newNode.value = line[newNode.name]
                    }
                } else if (newNode.dataset.name && line[newNode.dataset.name]) {
                    newNode.innerHTML = line[newNode.dataset.name]
                }
                return newNode
            })();
            if (newNode.name === this.toDelete.name && line.type === 'suppression') {
                newNode.dataset.expression = `${newNode.dataset.expression} negate`
                if (domNode.dataset.relatedPosition) {
                    const relNode = this.querySelector(`div[data-position="${domNode.dataset.relatedPosition}"] [name="${newNode.name}"]`)
                    if (relNode) {
                        newNode.dataset.expression = `${relNode.dataset.expression} negate`
                    }
                } 
            }
            if (!newNode.dataset.expression) {
                newNode.setAttribute('tabindex', (prePos * 10000) + ++this.tabIndexCount)
            } else {
                newNode.setAttribute('tabindex', -1)
                newNode.setAttribute('readonly', true)
                newNode.dataset.readonly = 'true'
            }
            if (node.getAttribute('tabindex') === '-1') {
                newNode.setAttribute('tabindex', -1)
            }
            if (node.hasAttribute('mandatory')) {
                newNode.setAttribute('mandatory', true)
            }

            /* if we have installTextarea, we wrap into a container in case
             * it replaces the parent node which many editor found do this.
             * And, in case it doesn't replace the parent node, the function
             * installTextarea can do this itself (the other way around is 
             * possible, but the 4 editors I tested replaced the parent 
             * node).
             */
            if (newNode.tagName === 'TEXTAREA' && this.installTextarea) {
                const container = document.createElement('div')
                container.classList.add('account-line__textarea')
                container.appendChild(newNode)
                domNode.appendChild(container)
                const installedTextaread = this.installTextarea(newNode, line.state === 'open')
                if (node.hasAttribute('mandatory')) { installedTextaread.setAttribute('mandatory', true) }
                if (node.getAttribute('readonly') === 'true') { installedTextaread.setAttribute('readonly', true) }
                return
            }
            domNode.appendChild(newNode)
        })

        const actionDiv = document.createElement('div')
        actionDiv.classList.add('account-line__actions')
        const button = document.createElement('button')
        button.type = 'button'
        button.classList.add('account-line__remove', 'account-line_button')
        button.innerText = '🗙'
        button.addEventListener('click', e => {
            this.removeLine(domNode)
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
        })
        const lock = (() => {
            if (this.id === line.docid || line.docid === undefined) {
                const lock = document.createElement('button')
                lock.type = 'button'
                return lock
            }
            return document.createElement('div')
        })();
        lock.classList.add('account-line__lock', 'account-line_button')
 
        if (line.state === 'open') {
            this.unlockLine(domNode)
            lock.innerText = '🔓'
            lock.dataset.action = 'freeze'
        } else {
            this.lockLine(domNode)
            lock.innerHTML = '🔒'
            lock.dataset.action = 'open'
        }
        
        lock.addEventListener('click', e => {
            if (e.target.dataset.action === 'freeze') {
                e.target.innerHTML = '🔒'
                e.target.dataset.action = 'open'
                this.lockLine(domNode)
                this.dispatchEvent(new CustomEvent('lock-line', {detail: this.getLineValue(domNode)}))
            } else {
                e.target.innerText = '🔓'
                e.target.dataset.action = 'freeze'
                this.unlockLine(domNode)
                this.dispatchEvent(new CustomEvent('unlock-line', {detail: this.getLineValue(domNode)}))
            }
            
        })
        actionDiv.appendChild(lock)
    
        actionDiv.appendChild(button)
        domNode.appendChild(actionDiv)

        this.insertLine(domNode)
        if (notEmpty) {
            this.update()
            this.dispatchEvent(new CustomEvent('update'))
        }
        return domNode
    }

    insertLine (line) {
        if (this.state !== 'open' && line.dataset.type === 'item') {
            for (let node = this.firstElementChild; node; node = node.nextElementSibling) {
                if (node.dataset.position > line.dataset.position || node.classList.contains('head-addition') || node.classList.contains('head-suppression')) {
                    this.insertBefore(line, node)
                    this.dispatchEvent(new CustomEvent('insert-line', {detail: line}))
                    return
                }
            }    
        }
        for (let node = this.firstElementChild; node; node = node.nextElementSibling) {
            if (node.dataset.position > line.dataset.position) {
                this.insertBefore(line, node)
                this.dispatchEvent(new CustomEvent('insert-line', {detail: line}))
                return
            }
        }
        this.dispatchEvent(new CustomEvent('insert-line', {detail: line}))
        this.appendChild(line)
    }

    addEmptyLine () {
        return this._addLine({})
    }

    update () {
        let intermediateValue = 0
        let intermediateCount = 0
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) {
                if (line === this.firstElementChild) { continue }
                RPNEvaluator.evaluate(`${intermediateValue} ~IVALUE${intermediateCount} str`)
                intermediateCount++
                intermediateValue = 0
                continue 
            }
            const inputs = line.querySelectorAll('[data-expression]')
            inputs.forEach(input => {
                if (input.dataset.deleted === 'true') { input.value = 0;  return }
                const value = RPNEvaluator.evaluate(
                    RPNEvaluator.setVariables(input.dataset.expression, line)
                )
                if (this.precision !== null) {
                    input.value = value.toFixed(this.precision)
                } else {
                    input.value = value
                }
                intermediateValue += value
            })
        }
        RPNEvaluator.evaluate(`${intermediateValue} ~IVALUE${intermediateCount} str`)
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
                lineValue.related = lineValue.id
                delete lineValue.id
            }
            const newLine = this._addLine(lineValue)
            node.addEventListener('change', e => {
                if (e.target.getAttribute('no-copy') !== null) { return }
                newLine.querySelector(`[name="${e.target.name}"]`).value = e.target.value
            })
            node.addEventListener('delete', e => {
                this.removeLine(newLine)
            })
            return 
        }

        node.dispatchEvent(new CustomEvent('delete'))
        node.remove()
        this.indexes[0] = 0
        this.indexes[1] = 0
        this.indexes[2] = 0
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) { continue }
            let position = 0
            let prePos = 1
            switch(line.dataset.type) {
                case 'item': position = ++this.indexes[0]; break
                case 'addition': prePos = 2; position = ++this.indexes[1]; break
                case 'suppression': prePos = 3; position = ++this.indexes[2]; break
            }
            line.dataset.position = `${prePos}.${String(position).padStart(4, '0')}`
            line.querySelector('.account-line__position').innerText = line.dataset.position
            if (line.dataset.relatedPosition) {
                line.querySelector('.account-line__position').innerHTML += `<br><span class="relation">${line.dataset.relatedPosition}</span>`
            }
    
        }
    }

    renumber () {
        this.indexes = [0, 0, 0]
        for (let line = this.firstElementChild; line; line = line.nextElementSibling) {
            if (line.classList.contains('account-line__head')) { continue }
            let position = 0
            let prePos = 1
            switch(line.dataset.type) {
                case 'item': position = ++this.indexes[0]; break
                case 'addition': prePos = 2; position = ++this.indexes[1]; break
                case 'suppression': prePos = 3; position = ++this.indexes[2]; break
            }
            line.dataset.position = `${prePos}.${String(position).padStart(4, '0')}`
            line.querySelector('.account-line__position').innerText = line.dataset.position
            if (line.dataset.relatedPosition) {
                line.querySelector('.account-line__position').innerHTML += `<br><span class="relation">${line.dataset.relatedPosition}</span>`
            }
        }
    }

    handleNewLineEvents (event) {
        const target = event.target
        let parent = target
        while (parent && !parent.dataset?.index) { parent = parent.parentNode }
        if (!parent) { return }
        if (parent.dataset.type === 'suppression') {
            const input = this.querySelector(`div[data-position="${parent.dataset.relatedPosition}"] [name="${target.name}"]`)
            if (input) {
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
        if (newLine && parent.getAttribute('readonly') !== 'true') { this.addLine({type: parent.dataset.type}) }
    
        this.update()
        this.dispatchEvent(new CustomEvent('update'))
    }

    clearLines () {
        for (let line = this.firstElementChild; line;) {
            const nextLine = line.nextElementSibling
            if (line.classList.contains('account-line__head')) { line = nextLine; continue }
            line.remove()
            line = nextLine
        }
        this.indexes[0] = 0
        this.indexes[1] = 0
        this.indexes[2] = 0
    }

    loadLines (lines) {
        lines.sort((a, b) => parseFloat(a.position) * 1000 - parseFloat(b.position) * 1000)
        lines.forEach(line => {
            this.addLine(line)
        })
        this.querySelectorAll('*[data-related]').forEach(node => {
            const relnode = this.querySelector('[id="' + node.dataset.related + '"]')
            node.dataset.relatedPosition = relnode.dataset.position
            node.querySelector('.account-line__position').innerHTML = `${node.dataset.position}<br><span class="relation">${relnode.dataset.position}</span>`
        })
    }

    setLineId (linePosition, id) {
        const line = this.querySelector(`div[data-position="${linePosition}"]`)
        if (line) {
            line.id = id
            line.dataset.id = id
        }
    }

    setState (state) {
        switch(state) {
            case 'frozen':
                if (this.querySelectorAll('.head-addition').length === 0) {
                    const headAddition = document.createElement('div')
                    headAddition.dataset.position = '2.0000'
                    headAddition.classList.add('account-line__head', 'head-addition', 'head-intermediate')
                    headAddition.innerHTML = `<span></span><span style="grid-column: 2 / span ${this.heads.length - 1}">Complément</span><span><button type="button" class="account-line__add">+</button></span>`
                    this.appendChild(headAddition)
                    headAddition.querySelector('button').addEventListener('click', e => {
                        this.addLine({type: 'addition'})
                    })
                }
                if (this.querySelectorAll('.head-suppression').length === 0) {
                    const headSuppression = document.createElement('div')
                    headSuppression.dataset.position = '3.0000'
                    headSuppression.classList.add('account-line__head', 'head-suppression', 'head-intermediate')
                    headSuppression.innerHTML = `<span></span><span style="grid-column: 2 / span ${this.heads.length - 1}">Suppression</span><span></span>`
                    this.appendChild(headSuppression)
                }

                this.querySelector('.head-items button.account-line__add')?.remove()
                break
            case 'open':
                this.querySelectorAll('.head-addition, .head-suppression')
                .forEach(node => {
                    node.remove()
                })
                break
        }
    }

    renderTextDiv (text) {
        const div = document.createElement('div')
        div.classList.add('account-line__rendered-textarea')
        div.dataset.type = 'textarea'
        if (text === '') {
            div.dataset.value = ''
            div.innerHTML = ''
        } else {
            div.innerHTML = this.parser(text)
            div.dataset.value = text
        }
        return div
    }

    renderTextArea (node) {
        const div = this.renderTextDiv(node.value)
        div.dataset.name = node.name
        div.dataset.readonly = node.getAttribute('readonly')
        div.setAttribute('tabindex', node.getAttribute('tabindex'))
        if (node.hasAttribute('mandatory')) { div.setAttribute('mandatory', true) }
        node.replaceWith(div)
    }

    unrenderTextArea (node) {
        if (node.dataset.readonly === 'true') { return }
        const editLine = document.createElement('div')
        const textarea = document.createElement('textarea')
        textarea.setAttribute('tabindex', node.getAttribute('tabindex'))
        textarea.value = node.dataset.value
        textarea.name = node.dataset.name
        if (node.hasAttribute('mandatory')) { textarea.setAttribute('mandatory', true) }
        node.replaceWith(textarea)
        textarea.focus()
    }

    connectedCallback() {
        this.autoscrollRun = false
        this.dataset.dndDropzone = true
        const headNode = document.createElement('div')
        const state = this.getAttribute('state')
        this.precision = this.getAttribute('precision') === null ? null : parseInt(this.getAttribute('precision'))
        if (Number.isNaN(this.precision) || this.precision < 0) { this.precision = null }
        if (state) {
            this.state = state
        }

        const autoscroll = (rate) => {
            const refreshRate = 80
            if (rate === 0) { return }
            if (!this.autoscrollRun) { return }
            
            window.scrollTo(0, document.documentElement.scrollTop + rate)
            
            setTimeout(() => { autoscroll(rate) }, refreshRate)
        }

        window.addEventListener('dnd-over', e => {
            const fromEdge = 50

            /* not OUR dragover, exit */
            if (!this.dnd.pholder) { return }
            
            if (e.detail.y < fromEdge) {
                const rate = Math.pow(1 + (fromEdge - e.detail.y) / fromEdge, 3)
                this.autoscrollRun = true
                return autoscroll(-rate)
            } else if (e.detail.y  > window.innerHeight - fromEdge) {
                const rate = Math.pow(1 + (e.detail.y- window.innerHeight + fromEdge ) / fromEdge, 3)
                this.autoscrollRun = true
                return autoscroll(rate)
            }
            this.autoscrollRun = false
        })

        this.addEventListener('dnd-cancel', e => {
            this.autoscrollRun = false
            this.classList.remove('dnd-in-progress')
            if (this.dnd.pholder) {
                this.dnd.pholder.remove()
                this.dnd.pholder = null
            }
            this.dnd.node.classList.remove('account-line__dragging')
            this.dnd.node.parentNode.insertBefore(this.dnd.node, this.dnd.nodeAfter)
        })

        this.addEventListener('dnd-drop', e => {
            this.autoscrollRun = false
            this.classList.remove('dnd-in-progress')

            this.dnd.node.classList.remove('account-line__dragging')

            if (this.dnd.pholder) {
                this.dnd.pholder.remove()
                this.dnd.pholder = null
            }
            this.dnd.node.classList.remove('account-line__dragging')
            this.renumber()
        })
        this.addEventListener('keyup', e => this.handleNewLineEvents(e))
        this.addEventListener('change', e => this.handleNewLineEvents(e))
        this.addEventListener('focus', e => {
            const node = e.target
            switch(e.target.tagName) {
                case 'DIV':
                    if (this.installTextarea) { return }
                    if (node.dataset.type === 'textarea') {
                        this.unrenderTextArea(node)
                    }
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                    this.handleNewLineEvents(e)
            }
        }, {capture: true})

        this.addEventListener('blur', event => {
            const node = event.target
            if (node.tagName === 'TEXTAREA' && !this.installTextarea) {
               this.renderTextArea(node)
            }
        }, {capture: true})

        const headDefinition = this.querySelector('account-head-definition')
        headNode.classList.add('account-line__head', 'head-items')
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
                
        this.setState(this.state)
    }
}

class AccountSummary extends HTMLElement {
    constructor () {
        super()
        this.for = null
        this.precision = null
    }

    getEvaluator () {
        return RPNEvaluator
    }

    evaluate (expression) {
        expression = RPNEvaluator.setVariables(expression, this)
        if (this.for) { expression = RPNEvaluator.setVariables(expression, this.for) }
        return RPNEvaluator.evaluate(expression)
    }

    update () {
        const nodes = []
        Array.from(this.querySelectorAll('[data-expression]'))
        .forEach(node => {
            nodes.push({
                value: 0,
                dom: node,
                name: node.getAttribute('name'),
                require: [...RPNEvaluator.getVariables(node.dataset.expression)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map(value => value.substring(1)), ...RPNEvaluator.getRequiredRegisters(node.dataset.expression)
                    .filter((value, index, self) => self.indexOf(value) === index)],
                provide: [node.getAttribute('name') ?? '__NONE__', ...RPNEvaluator.getProvidedRegisters(node.dataset.expression)
                    .filter((value, index, self) => self.indexOf(value) === index)],
                next: []
            })
        })
        nodes.forEach(node => {
            node.require.forEach(require => {
                nodes.forEach(other => {
                    if (other.provide.includes(require)) {
                        node.next.push(other)
                    }
                })
            })
        })

        const traverseGraph = (node, visited = new Set(), recursionStack = new Set()) => {
            if (recursionStack.has(node)) { 
                throw new Error('Cyclic dependency') 
            }
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
        nodes.forEach(node => {
            node.dom.innerHTML = this.precision === null ? node.value : node.value.toFixed(this.precision)
        })
    }

    connectedCallback () {
        const forNode = this.getAttribute('for')
        this.precision = this.getAttribute('precision') === null ? null : parseInt(this.getAttribute('precision'))
        if (Number.isNaN(this.precision) || this.precision < 0) { this.precision = null }
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