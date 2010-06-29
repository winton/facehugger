require 'rubygems'
gem 'require'
require 'require'

Require do
  gem(:active_wrapper, '=0.2.5') { require 'active_wrapper' }
  gem :cucumber, '=0.6.2'
  gem(:haml, '=2.2.17') { require %w(haml sass) }
  gem(:lilypad, '=0.3.0') { require 'lilypad' }
  gem(:'rack-flash', '=0.1.1') { require 'rack-flash' }
  gem(:'rack-test', '=0.5.3') { require 'rack/test' }
  gem(:rake, '=0.8.7') { require 'rake' }
  gem :require, '=0.2.7'
  gem :rspec, '=1.3.0'
  gem(:sinatra, '=1.0') { require 'sinatra/base' }
  
  gemspec do
    author 'Winton Welsh'
    dependencies do
      gem :active_wrapper
      gem :haml
      gem :lilypad
      gem :'rack-flash'
      gem :require
      gem :sinatra
    end
    email 'mail@wintoni.us'
    name 'facehugger'
    homepage "http://github.com/winton/#{name}"
    summary ""
    version '0.1.0'
  end
  
  bin { require 'lib/facehugger' }
  
  console do
    gem :active_wrapper
    gem :sinatra
    gem :active_wrapper
    require 'lib/facehugger/boot/application'
    require 'lib/facehugger/boot/sinatra'
    require 'lib/facehugger/boot/active_wrapper'
    require 'lib/facehugger/boot/model'
  end
  
  lib do
    gem :haml
    gem :sinatra
    gem :active_wrapper
    gem :'rack-flash'
    require 'lib/facehugger/boot/application'
    require 'lib/facehugger/boot/sinatra'
    require 'lib/facehugger/boot/session'
    require 'lib/facehugger/boot/flash'
    require 'lib/facehugger/boot/active_wrapper'
    require 'lib/facehugger/boot/lilypad'
    require 'lib/facehugger/boot/controller'
    require 'lib/facehugger/boot/helper'
    require 'lib/facehugger/boot/model'
  end
  
  rakefile do
    gem(:active_wrapper) { require 'active_wrapper/tasks' }
    gem(:rake) { require 'rake/gempackagetask' }
    gem(:rspec) { require 'spec/rake/spectask' }
    require 'require/tasks'
  end
  
  spec_helper do
    gem :'rack-test'
    require 'require/spec_helper'
    require 'lib/facehugger'
    require 'pp'
  end
end