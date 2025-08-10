"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate the multiple threads.
 * 
 * @author Chang Kejun
 */
class Threads extends Debuggable{
	/**
	 * Create instance
	 *
	 * @param {Number}
	 *            maxCount: required
	 */
	constructor(maxCount){
		super();
		if (maxCount){
			this.#maxCount=maxCount;
		}
	}
	/**
	 * The internal variable to keep objects of thread.
	 */
	#threads = [];
	#maxCount = 4;
	/**
	 * Add method to add an thread object for running.
	 * 
	 * @param {Object}
	 *            thread: required<br>
	 *           
	 * @returns {this}
	 */
	add(thread){
		this.#threads.push(thread);
		return this;
	}
	/**
	 * Run method to execute all thread objects and wait the complement of all threads
	 * 
	 * @returns {Record}
	 */
	run(){
		let handles = [];
		let semaphore = new java.util.concurrent.Semaphore(this.#maxCount);  
		for(let i = 0 ; i<this.#threads.length ; i++){
			this.#threads[i]._run=this.#threads[i].run;
			this.#threads[i].run=function(){
				try{
					semaphore.acquire();
					this._run();
				}catch(e){
					if (e instanceof Error)e=""+e;
					//このログはフロントに戻れない
					Packages.efw.framework.runtimeSLog("One thread failed.",e);
				}finally{
					semaphore.release();
				}
			};
			handles[i] = new java.lang.Thread(
				new java.lang.Runnable(this.#threads[i])
			);
			handles[i].start();
		}
		for(let i = 0 ; i<this.#threads.length ; i++){
			handles[i].join();
		}
		return new Record(this.#threads);
	}
}
