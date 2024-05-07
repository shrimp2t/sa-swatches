module.exports = function (grunt) {
	var pkgInfo = grunt.file.readJSON("package.json");
	grunt.initConfig({
		pkg: pkgInfo,
		copy: {
			main: {
				options: {
					mode: true,
				},
				src: [
					"**",
					"!node_modules/**",
					"!codecanyon/**",
					"!docs/**",
					"!doc/**",
					"!css/sourcemap/**",
					"!.git/**",
					"!bin/**",
					"!.gitlab-ci.yml",
					"!bin/**",
					"!tests/**",
					"!phpunit.xml.dist",
					"!*.sh",
					"!*.map",
					"!Gruntfile.js",
					"!package.json",
					"!.gitignore",
					"!phpunit.xml",
					"!README.md",
					"!sass/**",
					"!codesniffer.ruleset.xml",
					"!vendor/**",
					"!composer.json",
					"!composer.lock",
					"!package-lock.json",
					"!phpcs.xml.dist",
				],
				dest: `${pkgInfo.name}/`,
			},
		},

		compress: {
			main: {
				options: {
					archive: `${pkgInfo.name}-v` + pkgInfo.version + ".zip",
					mode: "zip",
				},
				files: [
					{
						src: [`./${pkgInfo.name}/**`],
					},
				],
			},
		},

		clean: {
			main: [`${pkgInfo.name}`],
			js: ["frontend"],
			zip: ["*.zip"],
		},

		bumpup: {
			options: {
				updateProps: {
					pkg: "package.json",
				},
			},
			file: "package.json",
		},

		replace: {
			plugin_main: {
				src: ["plugin.php"],
				overwrite: true,
				replacements: [
					{
						from: /Version: \bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?(?:\+[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?\b/g,
						to: "Version: <%= pkg.version %>",
					},
				],
			},
		},

		shell: {
			build: {
				command: "yarn build",
			},
		},

		makepot: {
			target: {
				options: {
					cwd: "./",
					domainPath: "languages/",
					potFilename: "sa-wc-swatches.pot", // Name of the POT file.
					type: "wp-plugin", // Type of project (wp-plugin or wp-theme).
				},
			},
		},
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-wp-i18n");
	grunt.loadNpmTasks("grunt-bumpup");
	grunt.loadNpmTasks("grunt-text-replace");
	grunt.loadNpmTasks("grunt-shell");

	// To release new version just runt 2 commands below
	// Re create everything: grunt release --ver=<version_number>
	// Zip file installable: grunt zipfile

	grunt.registerTask("zipfile", [
		"clean:zip",
		"copy:main",
		"compress:main",
		"clean:main",
	]);
	grunt.registerTask("release", function (ver) {
		grunt.task.run("clean:zip");
		grunt.task.run("clean:js");
		grunt.task.run("shell:build");
		// Replace new version
		let newVersion = pkgInfo.version;
		grunt.task.run("bumpup:" + newVersion);
		grunt.task.run("replace");
		grunt.task.run("zipfile");
		// i18n
		// grunt.task.run(['addtextdomain', 'makepot']);
	});
};
