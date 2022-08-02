<template>
	<v-app>
		<div>
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
				<span>
					{{pagetitle}}{{"  -  "}}{{swname}}
				</span>
				<v-spacer />
				<template>
					<div class="button-tooltip">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon @click.stop="minwin" v-bind="attrs" v-on="on">mdi-window-minimize</v-icon>
							</template>
							<span>ウィンドウを最小化します</span>
						</v-tooltip>
					</div>
				</template>
				<template v-if="windowState.maximized">
					<div class="button-tooltip">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon @click.stop="maxwin" v-bind="attrs" v-on="on">mdi-window-restore</v-icon>
							</template>
							<span>ウィンドウを元のサイズに戻します</span>
						</v-tooltip>
					</div>
				</template>
				<template v-else>
					<div class="button-tooltip">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon @click.stop="maxwin" v-bind="attrs" v-on="on">mdi-window-maximize</v-icon>
							</template>
							<span>ウィンドウを最大化します</span>
						</v-tooltip>
					</div>
				</template>
				<template>
					<div class="button-tooltip">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon @click.stop="closewin" v-bind="attrs" v-on="on">mdi-window-close</v-icon>
							</template>
							<span>ウィンドウを閉じます</span>
						</v-tooltip>
					</div>
				</template>
			</v-system-bar>
			<v-toolbar dense style="margin-top:30px; margin-bottom: 2px;">
				<v-icon v-if="cangoback" @click.stop="goback">mdi-arrow-left</v-icon>
				<v-icon v-else color="grey lighten-2">mdi-arrow-left</v-icon>
				<v-icon v-if="cangofowd" @click.stop="goforward">mdi-arrow-right</v-icon>
				<v-icon v-else color="grey lighten-2">mdi-arrow-right</v-icon>
				<v-icon @click.stop="reloadwv">mdi-refresh</v-icon>
				<v-icon @click.stop="navigatehome">mdi-home</v-icon>
				<div>
					<div v-if="cert == 'ok'">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attr}">
								<div v-on="on" v-bind="attr">
									<v-icon color="blue">mdi-lock</v-icon>
									<span>保護された通信</span>
								</div>
							</template>
							<span>このサイトで入力した情報が第三者に傍受されることはありません</span>
						</v-tooltip>
					</div>
					<div v-else-if="islocal">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attr}">
								<div v-on="on" v-bind="attr">
									<v-avatar size="24" color="grey lighten-2"><span style="font-size: 12px"><sub>42</sub>M</span></v-avatar>
									<span>保護されたページ</span>
								</div>
							</template>
							<span><sub>42</sub>Molybdenum の内蔵ページを表示しています。</span>
						</v-tooltip>
					</div>
					<div v-else>
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attr}">
								<div v-on="on" v-bind="attr">
									<v-icon color="grey">mdi-lock-off</v-icon>
									<span>保護されていません</span>
								</div>
							</template>
							<span>平文で通信しています。このサイトで入力した情報は傍受されることがあります。</span>
						</v-tooltip>
					</div>
				</div>
				<v-text-field hide-details single-line v-model="pageaddr" id="addrbar" style="margin-left: 4px;" @keydown.enter="navigateenter"></v-text-field>
			</v-toolbar>
		</div>
		<v-navigation-drawer v-model="drawer" right fixed app temporary width="40%" class="charm">
			<v-row class="fill-height" no-gutters>
				<template>
					<v-navigation-drawer dark mini-variant mini-variant-width="32" temporary hide-overlay v-model="drawer" stateless style="box-shadow: none;">
						<v-list dense>
							<v-tooltip right>
								<template v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'window' ? true : false" @click.stop="()=>changecharm('window')">
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
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'share' ? true : false" @click.stop="()=>changecharm('share')">
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
							<v-divider dark />
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'settings-general' ? true : false" @click.stop="()=>changecharm('settings-general')">
										<v-list-item-action>
											<v-icon>mdi-cog</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											一般設定
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>一般設定</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'settings-network' ? true : false" @click.stop="()=>changecharm('settings-network')">
										<v-list-item-action>
											<v-icon>mdi-lan-connect</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											ネットワーク設定
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>ネットワーク設定</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'settings-search' ? true : false" @click.stop="()=>changecharm('settings-search')">
										<v-list-item-action>
											<v-icon>mdi-magnify</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											検索設定
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>検索設定</span>
							</v-tooltip>
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'settings-privacy' ? true : false" @click.stop="()=>changecharm('settings-privacy')">
										<v-list-item-action>
											<v-icon>mdi-shield-account</v-icon>
										</v-list-item-action>
										<v-list-item-content>
											プライバシー設定
										</v-list-item-content>
									</v-list-item>
								</template>
								<span>プライバシー設定</span>
							</v-tooltip>
							<v-divider dark />
							<v-tooltip right>
								<template  v-slot:activator="{ on }">
									<v-list-item active-class="pink--text" v-on="on" :input-value="charmmode == 'information' ? true : false" @click.stop="()=>changecharm('information')">
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
									アドレスをコピー
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'settings-general'">
						<div>
							<v-list-item>
								<v-list-item-content>
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'settings-network'">
						<div>
							<v-list-item>
								<v-list-item-title class="text-wrap">
									現在ネットワークの構成を行うことは出来ません
								</v-list-item-title>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'settings-search'">
						<div>
							<v-list-item>
								<v-list-item-content>
									検索エンジン
								</v-list-item-content>
							</v-list-item>
							<v-list-item>
								<v-list-item-content>
									サジェスト
								</v-list-item-content>
							</v-list-item>
						</div>
					</template>
					<template v-else-if="charmmode == 'settings-privacy'">
						<div>
							<v-list-item>
								<v-list-item-content>
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
										Version {{ver}}<br>
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
		<v-main style="padding:0;">
			<webview id="wv-1" partition="persist:wvcontent" src="molybdenum://newtab" style="width:100%;height:100%;" :useragent="wvua"></webview>
		</v-main>
		<v-footer>
			<v-progress-linear :active="loading" indeterminate />
		</v-footer>
		<v-dialog v-model="sslerrordialog">
			<v-card>
				<v-card-title class="text-h5">
					証明書にエラーがあります
				</v-card-title>
				<v-card-text>
					このサイトが送信した証明書にはエラーがあります。<br>
					このサイトには接続することが出来ません。
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn @click="()=>{sslerrordialog = false;goback();}">前のページに戻る</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-app>
</template>


<script>
import { URL } from 'url';

export default {
	name: 'DefaultLayout',
	data() {
		return {
			drawer: false,
			windowState: {
				maximized: false,
			},
			title: 'Molybdenum',
			swname: '₄₂Molybdenum',
			ver: '0.999.202',
			wvua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1 (KHTML, like Gecko) Safari/605.1 Wolframium/104.0.0.0 Molybdenum/0.999.202",
			sysname: 'Yumemi',
			ntime: "00:00:00",
			charmmode: "window",
			charmname: {
				window: "ウィンドウ操作",
				share: "共有",
				"settings-general": "一般設定",
				"settings-network": "ネットワーク設定",
				"settings-search": "検索設定",
				"settings-privacy": "プライバシー設定",
				information: "アプリの情報",
				unknown: "不明"
			},
			loading: false,
			elecver: [],
			pagetitle: "",
			pageaddr: "",
			pageaddr2: "",
			cert: "plain",
			lastid: 1,
			currentid: 1,
			cangoback: false,
			cangofowd: false,
			sslerrordialog: false,
			sslerror: false,
			searchparam: "q",
			addrsearch: "https://www.ecosia.org/search",
			islocal: false,
			homeaddr: "https://www.msn.com",
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
				var wv = document.getElementById("wv-" + this.currentid);
				var addr = wv.getURL();
				var title = wv.getTitle();
				if (this.pageaddr2 != addr){
					this.pageaddr = addr;
					this.pageaddr2 = addr;
					if (this.pageaddr2.startsWith("http://")){
						this.islocal = false;
						this.cert = "plain";
					}else if (this.pageaddr2.startsWith("https://")){
						this.islocal = false;
						this.cert = "ok";
					}else if (
						this.pageaddr2.startsWith("molybdenum://") ||
						this.pageaddr2.startsWith("molybdenum-error://") ||
						this.pageaddr2.startsWith("molybdenum-extension://") ||
						this.pageaddr2.startsWith("chrome://") ||
						this.pageaddr2.startsWith("about:")
					){
						this.islocal = true;
						this.cert = "local";
					}
				}
				if (this.pagetitle != title){
					this.pagetitle = title;
				}
				this.cangoback = wv.canGoBack();
				this.cangofowd = wv.canGoForward();
			},250);
		},
		navigateenter(ev) {
			if (ev.keyCode !== 13) return;
			this.navigatewv();
		},
		navigatewv() {
			var wv = document.getElementById("wv-" + this.currentid);
			if (
				this.pageaddr.startsWith("http://") ||
				this.pageaddr.startsWith("https://") ||
				this.pageaddr.startsWith("molybdenum://") ||
				this.pageaddr.startsWith("molybdenum-error://") ||
				this.pageaddr.startsWith("molybdenum-extension://") ||
				this.pageaddr.startsWith("isbrp://") ||
				this.pageaddr.startsWith("isbrps://") ||
				this.pageaddr.startsWith("isbrpt://") ||
				this.pageaddr.startsWith("isbrpts://") ||
				this.pageaddr.startsWith("ftp://") ||
				this.pageaddr.startsWith("ftps://") ||
				this.pageaddr.startsWith("sftp://") ||
				this.pageaddr.startsWith("chrome://") ||
				this.pageaddr.startsWith("about:") ||
				this.pageaddr.startsWith("ws://") ||
				this.pageaddr.startsWith("wss://") ||
				this.pageaddr.startsWith("term-ssh://") ||
				this.pageaddr.startsWith("ssh://") ||
				this.pageaddr.startsWith("term://")
			){
				wv.loadURL(this.pageaddr);
			}else if (this.pageaddr.startsWith("? ") || this.pageaddr.startsWith("？　")){
				var sa = new URL(this.addrsearch);
				sa.search = this.searchparam + "=" + this.pageaddr.substr(2);
				wv.loadURL(sa);
			}else if (this.pageaddr.match(/[[\]_.!~*'()a-zA-Z0-9;/?:@&=+$,%#-]+/g) != null){
				wv.loadURL("http://" + this.pageaddr);
			}else{
				var sb = new URL(this.addrsearch);
				sb.search = this.searchparam + "=" + this.pageaddr;
				wv.loadURL(sb);
			}
		},
		navigatehome() {
			var wv = document.getElementById("wv-" + this.currentid);
			wv.loadURL(this.homeaddr);
		},
		reloadwv() {
			var wv = document.getElementById("wv-" + this.currentid);
			wv.reload();
		},
		goback() {
			var wv = document.getElementById("wv-" + this.currentid);
			wv.goBack();
		},
		goforward() {
			var wv = document.getElementById("wv-" + this.currentid);
			wv.goForward();
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
