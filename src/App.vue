<template>
	<v-app>
		<v-system-bar height="30" window app class="titlebar">
			<template>
				<div class="button-tooltip">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon @click.stop="opencharm" v-bind="attrs" v-on="on">mdi-menu</v-icon>
						</template>
						<span>チャームを開きます</span>
					</v-tooltip>
				</div>
			</template>
			<span>{{swname}}</span>
			<v-spacer></v-spacer>
			<template>
				<div class="button-tooltip">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon @click.stop="minwin" v-bind="attrs" v-on="on">mdi-window-minimize</v-icon>
						</template>
						<span></span>
					</v-tooltip>
				</div>
			</template>
			<template v-if="windowState.maximized">
				<div class="button-tooltip">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon @click.stop="maxwin" v-bind="attrs" v-on="on">mdi-window-restore</v-icon>
						</template>
						<span></span>
					</v-tooltip>
				</div>
			</template>
			<template v-else>
				<div class="button-tooltip">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon @click.stop="maxwin" v-bind="attrs" v-on="on">mdi-window-maximize</v-icon>
						</template>
						<span></span>
					</v-tooltip>
				</div>
			</template>
			<template>
				<div class="button-tooltip">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon @click.stop="closewin" v-bind="attrs" v-on="on">mdi-window-close</v-icon>
						</template>
						<span></span>
					</v-tooltip>
				</div>
			</template>
		</v-system-bar>
		<v-navigation-drawer v-model="drawer" right fixed app temporary width="40%" class="charm">
			<v-row class="fill-height" no-gutters>
				<template>
					<v-navigation-drawer dark mini-variant mini-variant-width="32" temporary hide-overlay v-model="drawer" stateless style="box-shadow: none;">
						<v-list dense>
							<v-tooltip right>
								<template v-slot:activator="{ on }">
									<v-list-item active-class="amber--text" v-on="on" :input-value="charmmode == 'window' ? true : false" @click.stop="()=>changecharm('window')">
										<v-list-item-action>
											<v-icon>mdi-window-restore</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											ウィンドウ操作
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>ウィンドウ操作</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="amber--text" v-on="on" :input-value="charmmode == 'share' ? true : false" @click.stop="()=>changecharm('share')">
										<v-list-item-action>
											<v-icon>mdi-share-variant</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											共有
										</v-list-item-content>
									</v-list-item>
								</template>
							<span>共有</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="amber--text" v-on="on" :input-value="charmmode == 'settings' ? true : false" @click.stop="()=>changecharm('settings')">
										<v-list-item-action>
											<v-icon>mdi-cog</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											アプリの設定
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>アプリの設定</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="amber--text" v-on="on" :input-value="charmmode == 'information' ? true : false" @click.stop="()=>changecharm('information')">
										<v-list-item-action>
											<v-icon>mdi-information</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											アプリの情報
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>アプリの情報</span>
							</v-tooltip>
						</v-list>
					</v-navigation-drawer>
				</template>
				<v-list class="grow" width="calc(100% - 32px)">
					<v-list-item>
						<v-list-item-content>
							<v-list-item-title class="text-h6">{{sysname}}Charm</v-list-item-title>
							<v-list-item-subtitle v-text="getcharmname()"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-divider></v-divider>
					<template v-if="charmmode == 'window'">
						<div>
							<v-list-item @click.stop="closecharm">
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										チャームを閉じる
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item @click.stop="() => closecharm(closewin)">
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										ウィンドウを閉じる
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item @click.stop="() => closecharm(maxwin)">
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										<span v-if="windowState.maximized">元のサイズ</span>
										<span v-else>最大化</span>
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item @click.stop="() => closecharm(minwin)">
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										最小化
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'share'">
						<div>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										このアプリから共有することは出来ません。
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'settings'">
						<div>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title class="text-wrap">
										時計のスタイル
									</v-list-item-title>
									<v-select dense :items="clocktype"></v-select>
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'information'">
						<div>
							<v-subheader>ソフトウェアバージョン</v-subheader>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										{{swname}}
									</v-list-item-title>
									<v-list-item-subtitle>
										Version 0.999.001<br>
										Copyright &copy; 2022 ISnow Systems
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-divider></v-divider>
							<v-subheader>エンジン情報</v-subheader>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										{{sysname}}System
									</v-list-item-title>
									<v-list-item-subtitle>{{ver}}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										{{sysname}}Charm
									</v-list-item-title>
									<v-list-item-subtitle>{{ver}}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										Electron
									</v-list-item-title>
									<v-list-item-subtitle v-text="elecver['electron']"></v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										Chromium
									</v-list-item-title>
									<v-list-item-subtitle v-text="elecver['chrome']"></v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										v8
									</v-list-item-title>
									<v-list-item-subtitle v-text="elecver['v8']"></v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else>
						<div>
							<v-subheader>不明なチャームの種類</v-subheader>
						</div>
					</template>
				</v-list>
			</v-row>
		</v-navigation-drawer>
		<v-main>
			<v-container>
				<router-view></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>


<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			drawer: false,
			windowState: {
				maximized: false,
			},
			title: 'IcyClock',
			swname: 'IcyClock',
			ver: '0.999.001',
			sysname: 'Alice',
			ntime: "00:00:00",
			charmmode: "window",
			charmname: {
				window: "ウィンドウ操作",
				share: "共有",
				settings: "アプリの設定",
				information: "アプリの情報",
				unknown: "不明"
			},
			elecver: [],
			clocktype: [
				"アナログ",
				"デジタル",
				"曖昧なアナログ",
				"曖昧なデジタル",
				"二進数"
			],
		}
	},
	mounted() {
		this.ntimesetter();
		//window.electron.ipcon("maxstat",this.maxinfo);
		window.electron.retmax(this.maxinfo);
		window.electron.checkmax();
		this.elecver = window.electron.version;
	},
	methods: {
		ntimesetter() {
			return setInterval(()=>{
				this.ntime = (new Date()).toLocaleTimeString();
			},250);
		},
		opencharm() {
			this.drawer = true;
			this.charmmode = "window";
		},
		closecharm(func,...argv) {
			if (func != null) func(...argv);
			this.drawer = false;
		},
		changecharm(v) {
			this.charmmode = v;
		},
		minwin() {
			window.electron.minimize();
		},
		maxwin() {
			if (this.windowState.maximized){
				window.electron.unmaximize();
			}else{
				window.electron.maximize();
			}
		},
		closewin() {
			window.electron.close();
		},
		maxinfo(e,v) {
			console.info(v);
			this.windowState.maximized = v == 0;
			console.info("最大化状態：",v == 0);
		},
		getcharmname() {
			return this.charmname[this.charmmode] ?? this.charmname["unknown"];
		}
	}
}
</script>
