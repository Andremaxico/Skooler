import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';
import { AppMenu } from '../Header/AppMenu';

type PropsType = {};

export const Sidebar: React.FC<PropsType> = ({}) => {
	const [collapsed, setCollapsed] = useState<boolean>(false);

	return (
		<Sider 
			collapsible collapsed={collapsed} 
			onCollapse={value => setCollapsed(value)}
			breakpoint={"lg"}
			theme="light"
			collapsedWidth={0}
			style={{paddingTop: '74px'}}
		>
        <AppMenu mode='vertical' />
      </Sider>
	)
}
