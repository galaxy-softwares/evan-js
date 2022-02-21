import { ResourceErrorTarget } from '../types/common'
import { transportData } from '../core/transportData'
import { getTimestamp } from '../utils/helpers'
import { errorTransform, performanceTransform, resourceTransform } from '../core/transformData'

const HandleEvents = {
  // handleDomOperation(event) {
  //   const data = {
  //     class_name: event.target.className,
  //     inner_text: event.target.innerText,
  //     tag_name: event.target.tagName,
  //     behavior_type: event.type,
  //     input_value: event.target.inputValue,
  //     placeholder: event.target.placeholder,
  //     action_type: 'OPERATION',
  //     happen_time: getTimestamp()
  //   }
  //   transportData.send(data)
  // },
  /**
   * 处理xhr、fetch回调
   */
  handleHttp(data): void {
    transportData.send(data)
  },
  /**
   * 处理window的error的监听回到
   */
  handleError(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget
    if (target.localName) {
      // 资源加载错误 提取有用数据
      const data = resourceTransform(errorEvent.target as ResourceErrorTarget)
      return transportData.send(data)
    }
    const data = errorTransform(target as ErrorEvent)
    transportData.send(data)
  },
  handleHistory(data: any): void {
    HandleEvents.handlePv(data)
  },
  handleHashchange(data: HashChangeEvent): void {
    HandleEvents.handlePv(data)
  },
  handleUnhandleRejection(event: PromiseRejectionEvent): void {
    console.log(event, 'ev')
  },
  handlePerformance(): void {
    const performance = window.performance
    if (!performance || 'object' !== typeof performance) return
    performanceTransform((data) => {
      transportData.send(data)
    })
  },
  handlePv(data: HashChangeEvent): void {
    const history = {
      page_url: data.newURL,
      action_type: 'PAGE_VIEW',
      document_title: document.title,
      referrer: data.oldURL,
      encode: document.charset,
      happen_time: getTimestamp()
    }
    transportData.send(history)
  }
}

export { HandleEvents }
