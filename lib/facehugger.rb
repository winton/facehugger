require 'rubygems'
require 'bundler'

Bundler.require(:lib)

$:.unshift File.dirname(__FILE__) + '/facehugger'

require 'version'

require 'boot/application'
require 'boot/sinatra'
require 'boot/controller'
require 'boot/helper'