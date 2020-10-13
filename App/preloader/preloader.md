    preloadImages(urlOfImages) {
    	// an array of urls of images
    	let preFetchTasks = []
    	urlOfImages.forEach((url) => {
    		preFetchTasks.push(Image.prefetch(url))
    	})

    	Promise.all(preFetchTasks).then((results) => {
    		try {
    			let downloadedAll = true
    			results.forEach((result) => {
    				if (!result) {
    					//error occurred downloading a pic
    					downloadedAll = false
    				}
    			})
    		} catch (e) {}
    	})
    }

    collectUrls() {
    	const ar = []
    	var counter = 0
    	firebase
    		.firestore()
    		.collection('posts')
    		.get()
    		.then((querySnapshot) => {
    			const n = querySnapshot.size
    			querySnapshot.forEach((doc) => {
    				const entity = doc.data()
    				//console.log(entity.image)
    				counter += 1
    				ar.push(entity.image)
    				if (counter == n) {
    					this.preloadImages(ar)
    				}
    			})
    		})
    }

// in componentDidMount

    	//this.collectUrls()
