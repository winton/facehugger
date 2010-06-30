Application.class_eval do
  
  get '/' do
    @app_id = File.read(self.class.root + '/config/app_id.txt').strip
    haml :test
  end
end