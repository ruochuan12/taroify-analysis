import { View } from "@tarojs/components"
import classNames from "classnames"
import * as React from "react"
import { cloneElement, CSSProperties, ReactElement, ReactNode, useMemo } from "react"
import { prefixClassname } from "../styles"
import SidebarTab from "./sidebar-tab"
import { SidebarTabEvent, SidebarTabKey } from "./sidebar-tab.shared"
import SidebarContext from "./sidebar.context"

function arrayChildren(children?: ReactNode) {
  return React.Children.map(children, (node: ReactNode, index) => {
    if (!React.isValidElement(node)) {
      return node
    }
    const element = node as ReactElement
    if (element.type !== SidebarTab) {
      return element
    }
    const { props } = element
    return cloneElement(element, {
      ...props,
      __dataKey__: element.key ?? index,
      __dataIndex__: index,
    })
  })
}

export interface SidebarProps {
  className?: string
  style?: CSSProperties
  activeKey?: SidebarTabKey
  children?: ReactNode
  onChange?: (event: SidebarTabEvent) => void
}

function Sidebar(props: SidebarProps) {
  const { className, style, activeKey, onChange } = props

  const children = useMemo(() => arrayChildren(props.children), [props.children])

  function emitClick(event: SidebarTabEvent) {
    if (!event.active && !event.disabled) {
      onChange?.(event)
    }
  }

  return (
    <View className={classNames(prefixClassname("sidebar"), className)} style={style}>
      <SidebarContext.Provider value={{ activeKey, emitClick }} children={children} />
    </View>
  )
}

export default Sidebar
